import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { News } from '../news';

@Component({
  selector: 'app-game-news-list',
  templateUrl: './game-news-list.component.html',
  styleUrls: ['./game-news-list.component.css']
})
export class GameNewsListComponent implements OnInit, OnDestroy {
  appId: string;
  fragment: string;
  gameNews: News[] =[];
  gameNews$: Subscription;
  maxArticles: number = 10;

  constructor(public newsService: NewsService, public userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      this.appId = params['appId'];

      document.querySelector(".title-container").scrollIntoView();

      // get news for appId every time it changes
      this.gameNews = [];
      if (this.gameNews$) {
        this.gameNews$.unsubscribe();
      }
      this.gameNews$ = this.newsService.getGameNews(this.appId, this.maxArticles)
      .subscribe(news => {
        this.gameNews = news;
      });
    });

    this.route.fragment.subscribe ( f => {
      this.fragment = f;
      this.scrollToFragment();
    });
  }

  scrollToFragment() {
    let element = document.querySelector ( "#" + this.fragment );
    if (element) element.scrollIntoView();
  }

  ngOnDestroy() {
    this.gameNews$.unsubscribe();
  }

}
