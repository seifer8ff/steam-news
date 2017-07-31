import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { News } from '../news';

@Component({
  selector: 'app-game-news-list',
  templateUrl: './game-news-list.component.html',
  styleUrls: ['./game-news-list.component.css']
})
export class GameNewsListComponent implements OnInit {
  appId: string;
  fragment: string;

  constructor(private newsService: NewsService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => this.appId = params['appId']);

    this.route.fragment.subscribe ( f => {
      this.fragment = f;
      this.scrollToFragment();
    });
  }

  scrollToFragment() {
    let element = document.querySelector ( "#" + this.fragment );
    window.location.hash = "";
    if (element) element.scrollIntoView();
  }

}
