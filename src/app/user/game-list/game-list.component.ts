import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { NewsService } from '../../news/news.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  constructor(private userService: UserService, private newsService: NewsService) { }

  ngOnInit() {
  }

}
