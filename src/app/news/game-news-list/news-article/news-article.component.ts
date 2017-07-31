import { Component, OnInit, Input } from '@angular/core';

import { News } from '../news';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.css']
})
export class NewsArticleComponent implements OnInit {
  @Input() newsItem: News;
  @Input() appId: string;

  constructor() { }

  ngOnInit() {
  }

}
