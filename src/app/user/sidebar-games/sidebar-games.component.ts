import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../user.service';
import { NewsService } from '../../news/news.service';
import { StateService } from '../../news/../state.service';

@Component({
  selector: 'app-sidebar-games',
  templateUrl: './sidebar-games.component.html',
  styleUrls: ['./sidebar-games.component.css'],
  animations: [
    trigger('sidebarState', [
      state('false', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('true', style({
        transform: 'translate3d(-120%, 0, 0)'
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ]),
    trigger('sidebarOverlayState', [
      state('false', style({
        opacity: '0.2'
      })),
      state('true', style({
        opacity: '0',
        display: 'none'
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarGamesComponent implements OnInit {
  hidden: boolean = true;
  onAltRoute: boolean = false;
  sidebarHidden$: Subscription;

  constructor(public userService: UserService, 
              private newsService: NewsService, 
              public stateService: StateService, 
              private router: Router) { }

  ngOnInit() {
    this.sidebarHidden$ = this.stateService.sidebarHidden$.subscribe(hidden => {
      this.hidden = hidden;
    });

    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(event => {
      this.onAltRoute = this.router.url.includes('games');
    })
  }

  ngOnDestroy() {
    this.sidebarHidden$.unsubscribe();
  }

}
