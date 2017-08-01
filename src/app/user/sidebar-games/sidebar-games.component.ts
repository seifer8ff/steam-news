import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { NewsService } from '../../news/news.service';

@Component({
  selector: 'app-sidebar-games',
  templateUrl: './sidebar-games.component.html',
  styleUrls: ['./sidebar-games.component.css']
})
export class SidebarGamesComponent implements OnInit {

  constructor(private userService: UserService, private newsService: NewsService) { }

  ngOnInit() {
  }

}
