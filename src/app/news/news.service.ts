import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';

import { News } from './news';
import { Game } from '../user/game';
import { UserService } from '../user/user.service';

@Injectable()
export class NewsService {

  allNews: {};
  allNews$: ReplaySubject<any> = new ReplaySubject(1);
  gameNews$: ReplaySubject<any> = new ReplaySubject(1);
  gameList: Game[];
  gameList$: Subscription;


  constructor(private http: Http, private userService: UserService) {
    this.init();
  }

  init() {
    this.gameList$ = this.userService.getGameList().subscribe(gameList => {
      this.gameList = gameList;
      console.log('news service picked up gameList change');
      console.log(this.gameList);
      this.getLatestNews(true);
    });
  }

  getLatestNews(forceRefresh: boolean) {
    if (forceRefresh) {
      let steamNewsURL = this.buildRequestURL(this.gameList, 1, null);
      this.http.get(steamNewsURL)
      .map((newsRes: Response) => newsRes.json())
      .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
      .subscribe(newsRes => {
        console.log("latest news from backend: ");
        console.log(newsRes);
        this.allNews = newsRes;
        this.allNews$.next(this.allNews);
      });
    }
    return this.allNews$.asObservable();
  }

  onAddGame(game: Game) {
    if (!this.allNews[game.appId]) {
      
      let steamNewsURL = this.buildRequestURL(this.gameList, 1, [game.appId]);
      console.log(steamNewsURL);

      this.http.get(steamNewsURL)
        .map((newsRes: Response) => newsRes.json())
        .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
        .subscribe(newsRes => {
          console.log('updated latest news: ');
          console.log(newsRes);
          this.allNews$.next(newsRes);
        });
    }
  }

  getGameNews(appId: string, limit: number) {
    let thisGameArray: Game[] = [
      new Game(appId, null)
    ];

    let steamNewsURL = this.buildRequestURL(thisGameArray, limit, null);
    this.http.get(steamNewsURL)
    .map((newsRes: Response) => newsRes.json())
    .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
    .map(newsRes => newsRes[appId])
    .subscribe(newsRes => {
      console.log("news for " + appId + ": ");
      console.log(newsRes);
      this.gameNews$.next(newsRes);
    });
    return this.gameNews$.asObservable();
  }

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

  buildRequestURL(gameList: Game[], limit: number, refreshIds?: string[],) {
    let finalUrl = '/api/news?';
    gameList.forEach(game => {
      finalUrl += 'id=' + game.appId + '&';
    });
    if (refreshIds) {
      refreshIds.forEach(appId => {
        finalUrl += 'refreshId=' + appId + '&';
      });
    }
    finalUrl += 'limit=' + limit;

    console.log(finalUrl);
    return finalUrl;
  }

}
