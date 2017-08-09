import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../user.service';
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

  constructor(private userService: UserService) { }

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
 
  select(game){
    this.query = game.title;
    // add game to backend using game.appId
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
