import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import 'rxjs/Rx';

import { News } from './news';
import { UserService } from '../user/user.service';

@Injectable()
export class NewsService {

  allNews: ReplaySubject<any> = new ReplaySubject(1);
  allNewsKeys: ReplaySubject<string[]> = new ReplaySubject(1);


  constructor(private http: Http, private userService: UserService) {}

  getAllNews(forceRefresh: boolean) {
    if (!this.allNews.observers.length || forceRefresh) {
      this.http.get('/api/news?id=440&id=361420')
      .map((res: Response) => res.json())
      .subscribe(data => {
        this.allNews.next(data);
        this.allNewsKeys.next(Object.keys(data));
      })
    }
    return this.allNews;
  }

  getAllNewsKeys() {
    if(!this.allNewsKeys.observers.length) {
      this.getAllNews(false);
    }
    return this.allNewsKeys;
  }

  // getNewsItem(appId: string, articleId: string) {
  //   console.log("fetching individual article");
  //   let news = this.allNews
  //   .subscribe();
  //   console.log(news);
  //   return news[appId].find((newsItem) => {
  //     return newsItem.articleId === articleId; 
  //   });
  // }

  // getNewsItem(articleId: string) {
  //   return this.allNews.find( (gameNews) => { 
  //     return gameNews.find((newsItem) => {
  //       return newsItem.articleId === articleId; 
  //     });
  //   });
  // }

}
