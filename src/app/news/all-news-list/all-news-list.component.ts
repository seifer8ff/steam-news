import { Component, OnInit } from '@angular/core';

import { NewsService } from '../news.service';
import { News } from '../news';

@Component({
  selector: 'app-all-news-list',
  templateUrl: './all-news-list.component.html',
  styleUrls: ['./all-news-list.component.css']
})
export class AllNewsListComponent implements OnInit {
  newsSummary: News[];

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsSummary = this.newsService.getAllNews();
  }

}
