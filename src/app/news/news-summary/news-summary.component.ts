import { Component, OnInit, Input } from '@angular/core';
import { slideUpAnimation } from '../../_animations/slideUpAnim';

import { News } from '../news';
import { Game } from '../../user/game';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
  animations: [slideUpAnimation],
  host: { '[@slideUpAnimation]': '' }
})
export class NewsSummaryComponent implements OnInit {
  @Input() article: News;


  constructor() { }

  ngOnInit() {
    
  }

}