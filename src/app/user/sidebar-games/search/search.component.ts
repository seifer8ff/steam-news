import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { UserService } from '../../user.service';
import { NewsService } from '../../../news/news.service';
import { Game } from '../../game';
import { User } from '../../user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  host: {
      '(document:click)': 'handleClick($event)',
  }
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchContainer') element; 
  query: string;
  filteredGames: Game[] = [];
  gameData: Game[];
  gameData$: Subscription;
  gameList: Game[];
  GameList$: Subscription;

  constructor(private userService: UserService, private newsService: NewsService, private router: Router) { }

  ngOnInit() {
    this.gameData$ = this.userService.getGameData().subscribe((games) => {
      this.gameData = games;
    });
    this.GameList$ = this.userService.getGameList().subscribe((games) => {
      this.gameList = games;
    });
  }

  filter() {
    if (this.query !== "") {
      this.filteredGames = this.gameData.filter((el) => {
        return el.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }).slice(0, 5);
    }else{
      this.filteredGames = [];
    }
  }
 
  select(game: Game) {
    // show game title in search bar
    this.query = game.title;
    
    // check if user already has game save to list
    if (!this.gameList.some(el => el.appId === game.appId)) {
      // add game to user's game list + get news from backend
      this.newsService.onAddGame(game.appId); 
      this.userService.onAddGame(game.appId);
    } else {
      // navigate to the game page and close the sidebar
      console.log("already have game");
      this.router.navigate(['news', game.appId]);
      this.userService.closeSidebar();
    }

    // clear list after short timeout
    setTimeout(() => {
      this.filteredGames = [];
    }, 500);
  }

  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.element.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(!inside) {
      this.filteredGames = [];
    }
  }

  ngOnDestroy() {
    this.gameData$.unsubscribe();
    this.GameList$.unsubscribe();
  }

}
