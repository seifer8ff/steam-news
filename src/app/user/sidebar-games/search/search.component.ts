import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../user.service';
import { NewsService } from '../../../news/news.service';
import { Game } from '../../game';

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

  constructor(private userService: UserService, private newsService: NewsService) { }

  ngOnInit() {
    this.gameData$ = this.userService.getGameData().subscribe((games) => {
      this.gameData = games;
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
 
  select(game) {
    // show game title in search bar
    this.query = game.title;

    // add game to user's game list + get news from backend
    this.newsService.onAddGame(game.appId); 
    this.userService.onAddGame(game.appId);

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
  }

}
