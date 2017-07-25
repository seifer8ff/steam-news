import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';

import { News } from './news';
import { UserService } from '../user/user.service';

@Injectable()
export class NewsService {

  allNews: ReplaySubject<any> = new ReplaySubject(1);
  allNewsKeys: ReplaySubject<string[]> = new ReplaySubject(1);
  
  gameNews: ReplaySubject<any> = new ReplaySubject(1);
  gameList: string[];


  constructor(private http: Http, private userService: UserService) {
    this.init();
  }

  init() {
    this.userService.getGameList()
    .subscribe(gameList => {
      this.gameList = gameList;
      console.log('news service picked up gameList change');
      console.log(this.gameList);
      this.getAllNews(true);
    });
  }

  getAllNews(forceRefresh: boolean) {
    if (forceRefresh) {
      console.log("fetching all news from backend");

      let steamNewsURL = this.buildRequestURL(this.gameList);
      this.http.get(steamNewsURL)
      .map((newsRes: Response) => newsRes.json())
      .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
      .subscribe(newsRes => {
        console.log('emitting all news');
        this.allNews.next(newsRes);
        this.allNewsKeys.next(Object.keys(newsRes));
      });
    }
    return this.allNews;
  }

  addGameNews(appId: string) {
    console.log('attempting to add game to news');

    let steamNewsURL = this.buildRequestURL(this.gameList, [appId]);
    console.log(steamNewsURL);
      this.http.get(steamNewsURL)
      .map((newsRes: Response) => newsRes.json())
      .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
      .subscribe(newsRes => {
        console.log('emitting all news');
        console.log(newsRes);
        this.allNews.next(newsRes);
        this.allNewsKeys.next(Object.keys(newsRes));
      });
  }

  getAllNewsKeys() {
    if(!this.allNewsKeys.observers.length) {
      this.getAllNews(false);
    }
    return this.allNewsKeys;
  }

  getGameNews(appId: string) {
    console.log("getting game news for appId: " + appId);
    this.getAllNews(false).subscribe((allNews) => {
      this.gameNews.next(allNews[appId]);
    });
    return this.gameNews;
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

  responseToNews(newsRes: any) {
    let processedNews = {};
    for (let game in newsRes) {
      processedNews[game] = newsRes[game].map(newsItem => {
        newsItem = Object.assign( new News(
          newsItem.title,
          newsItem.body,
          newsItem.url,
          newsItem.date,
          newsItem.appId,
          newsItem.articleId), newsItem);
          return newsItem;
      });
    }
    // console.log(processedNews);
    return processedNews;
  }

  buildRequestURL(gameList: string[], refreshIds?: string[]) {
    let finalUrl = '/api/news?';
    gameList.forEach(appId => {
      finalUrl += 'id=' + appId + '&';
    });
    if (refreshIds) {
      refreshIds.forEach(appId => {
        finalUrl += 'refreshId=' + appId + '&';
      });
    }
    return finalUrl;
  }

}
