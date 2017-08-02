import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../user.service';
import { NewsService } from '../../news/news.service';

@Component({
  selector: 'app-sidebar-games',
  templateUrl: './sidebar-games.component.html',
  styleUrls: ['./sidebar-games.component.css'],
  animations: [
    trigger('sidebarState', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
        style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('sidebarOverlayState', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
        style({opacity: '0'}))
      ])
    ]),
  ]
})
export class SidebarGamesComponent implements OnInit {

  constructor(private userService: UserService, private newsService: NewsService) { }

  ngOnInit() {
  }

}
