import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, animate, transition, style, query, group, animateChild, useAnimation } from '@angular/animations';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { Game } from '../../user/game'
import { News } from '../news'
import { slideInUpLong, slideOutDownLong, slideInDown, slideOutUp } from '../../_animations';

@Component({
  selector: 'app-all-news-list',
  templateUrl: './all-news-list.component.html',
  styleUrls: ['./all-news-list.component.css'],
  animations: [
    trigger('componentAnimations', [
      transition(':enter', [
        query('.title-container', [
          useAnimation(slideInDown)
        ], { optional: false }),
        query('#summary-container', [
          useAnimation(slideInUpLong)
        ], { optional: true })
      ]),
      transition(':leave', [
        query('#summary-container', [
          useAnimation(slideOutDownLong)
        ], { optional: true }),
        query('.title-container', [
          useAnimation(slideOutUp)
        ], { optional: false }),
      ])
    ])
  ]
})
export class AllNewsListComponent implements OnInit, OnDestroy {
  @HostBinding('@componentAnimations')
  gameList$: Subscription;
  latestNews$ : Subscription;
  gameList: Game[];
  latestNews: News[];

  constructor(private newsService: NewsService, private userService: UserService) { }

  ngOnInit() {
    document.querySelector(".title-container.main").scrollIntoView();

    this.latestNews$ = this.newsService.getLatestNews().subscribe(latestNews => {
      this.latestNews = latestNews;

      this.gameList$ = this.userService.getGameList().subscribe(gameList => {
        this.gameList = gameList;
      });
    });
  }

  ngOnDestroy() {
    this.latestNews$.unsubscribe();
    this.gameList$.unsubscribe();
  }

}
