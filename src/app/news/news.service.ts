import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { News } from './news';

@Injectable()
export class NewsService {
  allNews: News[];

  constructor(private http: Http) { }

  getNews(appId: string) {
    // if news is cached from previous API call, return observable of cached version
    if (this.allNews) return Observable.of(this.allNews);

    console.log("getting news");
    return this.http.get('/api/news/' + appId)
    .map(
      (res: Response) => {
        const data = res.json();
        var newsArr: News[] = [];
        data.appnews.newsitems.forEach((newsItem) => {
          newsArr.push(
            new News(
              newsItem.title,
              newsItem.contents,
              newsItem.url,
              newsItem.date,
              newsItem.appid,
              newsItem.gid
            )
          );
        });
        return newsArr;
      }
    )
    // cache news 
    .do(newArr => this.allNews = newArr )
    .publishReplay(1)
    .refCount();
  }

  getNewsItem(articleId: string) {
    return this.allNews.find( (newsItem) => { return newsItem.articleId === articleId; } );
  }

}
