import { Component, OnInit, Input } from '@angular/core';

import { News } from '../../news';
import { slideUpAnimation } from '../../../_animations/slideUpAnim';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.css'],
  animations: [slideUpAnimation],
  host: { '[@slideUpAnimation]': '' }
})
export class NewsArticleComponent implements OnInit {
  @Input() newsItem: News;
  @Input() appId: string;

  constructor() { }

  ngOnInit() {
  }

}
