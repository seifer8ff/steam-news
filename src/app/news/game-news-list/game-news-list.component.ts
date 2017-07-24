import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NewsService } from '../news.service';
import { News } from '../news';

@Component({
  selector: 'app-game-news-list',
  templateUrl: './game-news-list.component.html',
  styleUrls: ['./game-news-list.component.css']
})
export class GameNewsListComponent implements OnInit {
  appId: string;
  gameNews: News[];

  constructor(private newsService: NewsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => this.appId = params['appId']);

    this.newsService.getAllNews(false)
    .subscribe(allNews => this.gameNews = allNews[this.appId]);
  }

}
