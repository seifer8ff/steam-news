import { Component, OnInit, Input } from '@angular/core';

import { News } from '../news';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css']
})
export class NewsSummaryComponent implements OnInit {
  @Input() newsItem: News;

  constructor() { }

  ngOnInit() {
  }

  onViewMore() {

  }

}
