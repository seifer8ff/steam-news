import { Component, OnInit, Input } from '@angular/core';

import { News } from '../news';
import { Game } from '../../user/game';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css']
})
export class NewsSummaryComponent implements OnInit {
  @Input() newsItem: News;
  @Input() game: Game;

  constructor() { }

  ngOnInit() {
    
  }

}
