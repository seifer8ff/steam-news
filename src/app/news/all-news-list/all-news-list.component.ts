import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NewsService } from '../news.service';
import { News } from '../news';

@Component({
  selector: 'app-all-news-list',
  templateUrl: './all-news-list.component.html',
  styleUrls: ['./all-news-list.component.css']
})
export class AllNewsListComponent implements OnInit, OnDestroy {
  newsSummary: News[];
  newsSub: Subscription;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsSub = this.newsService.getNews('361420')
    .subscribe(
      (news) => {
        this.newsSummary = news;
      }
    );
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }

}
