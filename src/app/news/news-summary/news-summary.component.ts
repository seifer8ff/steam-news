import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { News } from '../news';
import { Game } from '../../user/game';
import { slideUpAnimation, slideDownAnimation } from '../../_animations';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.css'],
})
export class NewsSummaryComponent implements OnInit {
  @Input() article: News;


  constructor() { }

  ngOnInit() {
    
  }

}