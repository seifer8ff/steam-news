import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { News } from '../news';
import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.css']
})
export class NewsArticleComponent implements OnInit {
  newsItem: News;
  appId: string;
  articleId: string;

  constructor(private newsService: NewsService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        console.log('article params:');
        console.log(params);
        this.appId = params['appId'];
        this.articleId = params['articleId'];
      }
    );

    this.newsService.getAllNews(false)
    .subscribe(allNews => {
      this.newsItem = allNews[this.appId].find((newsItem) => {
        return newsItem.articleId === this.articleId; 
      });
    });
  }

}
