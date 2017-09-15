import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { Game } from '../../user/game'
import { News } from '../news'

@Component({
  selector: 'app-all-news-list',
  templateUrl: './all-news-list.component.html',
  styleUrls: ['./all-news-list.component.css']
})
export class AllNewsListComponent implements OnInit, OnDestroy {
  gameList$: Subscription;
  latestNews$ : Subscription;
  gameList: Game[];
  latestNews: News[];

  constructor(private newsService: NewsService, private userService: UserService) { }

  ngOnInit() {
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
