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

  latestNews: News[];
  latestNews$: ReplaySubject<any> = new ReplaySubject(1);
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
      this.updateLatestNews();
    });
  }

  updateLatestNews(refreshIds?: string[]) {
    let steamNewsURL = this.buildRequestURL(this.gameList, 1, refreshIds);
    this.http.get(steamNewsURL)
    .map((newsRes: Response) => newsRes.json())
    .map(newsRes => this.responseToNews(newsRes)) // turns JSON response objects into News objects (with methods)
    .map(news => this.sortNewsByDate(news))
    .subscribe(news => {
      console.log("latest news from backend: ");
      console.log(news);
      this.latestNews = news;
      this.latestNews$.next(this.latestNews);
    });
  }

  getLatestNews() {
    return this.latestNews$.asObservable();
  }

  onAddGame(game: Game) {
    if (!this.latestNews.some((article) => article.appId === game.appId)) {
      this.updateLatestNews([game.appId]);
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

  clearGameNews() {
    this.gameNews$.next(null);
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

  sortNewsByDate(news): News[] {
    var newsArray: News[] = [];

    for (let appId in news) {
      if (news[appId].length) {
        newsArray.push(news[appId][0]);
      }
    }

    newsArray.sort((a: any, b: any) => {
      return -(a.date - b.date);
    })

    return newsArray;
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
