import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { ArticleLoaderService } from '../article-loader.service';
import { News } from '../../news';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.css'],
})
export class NewsArticleComponent implements OnInit {

  @Input() newsItem: News;
  @Input() appId: string;
  @Input() isLast: boolean; // load more articles after scrolling to last

  constructor(private articleLoaderService: ArticleLoaderService, private elRef: ElementRef) { }

  ngOnInit() {
    if (this.isLast) {
      this.articleLoaderService.updateWatchComponent(this.elRef);
    }
  }

}
