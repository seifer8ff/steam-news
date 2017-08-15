import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { Game } from '../../user/game'
import { News } from '../News'

@Component({
  selector: 'app-all-news-list',
  templateUrl: './all-news-list.component.html',
  styleUrls: ['./all-news-list.component.css']
})
export class AllNewsListComponent implements OnInit, OnDestroy {
  gameList$: Subscription;
  allNews$ : Subscription;
  gameList: Game[];
  allNews: News[];

  constructor(private newsService: NewsService, private userService: UserService) { }

  ngOnInit() {
    this.allNews$ = this.newsService.getAllNews(false).subscribe(allNews => {
      this.allNews = allNews;

      this.gameList$ = this.userService.getGameList().subscribe(gameList => {
        this.gameList = gameList.filter(game => {
          return this.allNews[game.appId] && this.allNews[game.appId].length;
        });
      });
    });
  }

  ngOnDestroy() {
    this.allNews$.unsubscribe();
    this.gameList$.unsubscribe();
  }

}
