import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
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
  searchTimeout: number;

  gameList: Game[];
  GameList$: Subscription;

  constructor(private userService: UserService, private newsService: NewsService, private router: Router, private http: Http) { }

  ngOnInit() {
    this.GameList$ = this.userService.getGameList().subscribe((games) => {
      this.gameList = games;
    });
  }

  handleKeyup() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = window.setTimeout(() => {
        this.filter();
      }, 1000)
  }

  filter() {
    if (this.query !== "") {
      console.log("sending query to backend");
      let searchURL = "/api/games?q=" + this.query.toLowerCase();
      console.log(searchURL);
      this.http.get(searchURL)
      .map((gameListRes: Response) => gameListRes.json())
      .subscribe(gameList => {
        console.log('got gameList');
        console.log(gameList);
        this.filteredGames = gameList.slice(0,5);
      });
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
      this.newsService.onAddGame(game); 
      this.userService.onAddGame(game);
    } else {
      // navigate to the game page and close the sidebar
      console.log("already have game");
      this.router.navigate(['news', game.appId]);
      this.userService.closeSidebar();
    }

    // clear list after short timeout
    setTimeout(() => {
      this.filteredGames = [];
      this.router.navigate(['news', game.appId]);
      this.userService.closeSidebar();
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
    this.GameList$.unsubscribe();
  }

}
