import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { User } from './user';
import { Game } from './game';

@Injectable()
export class UserService {
  currentUser: User = new User(
    'Test User',
    [
      { appId: '440', title: 'Team Fortress 2' },
      { appId: '211820', title: 'Starbound' }
    ]
  );
  gameData: Game[] = [];
  gameListSub: ReplaySubject<Game[]> = new ReplaySubject(1);
  gameDataSub: ReplaySubject<Game[]> = new ReplaySubject(1);
  sidebarToggleSub: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: Http, private router: Router) {
    this.init();
  }

   init() {
     this.gameListSub
      .subscribe(gameList => this.currentUser.gameList = gameList);
    this.updateGameList();
    
    this.http.get('api/games')
      .map((gameDataRes: Response) => gameDataRes.json())
      .subscribe(gameDataRes => {
        this.gameDataSub.next(gameDataRes);
        this.gameDataSub.
          subscribe(gameData => this.gameData = gameData);
      });
  }

  getUser() {
    return this.currentUser;
  }

  getGameList() {
    return this.gameListSub;
  }

  getGameData() {
    return this.gameDataSub;
  }

  onAddGame(appId: string) {
    if (!this.currentUser.gameList.find(thisGame => thisGame.appId === appId)) {
      var newGame = new Game(appId, this.getGame(appId).title);
      
      this.currentUser.gameList.push(newGame);
      this.gameListSub.next(this.currentUser.gameList);

      let jsonHeaders = new Headers({
        'Content-Type': 'application/json'
      });

      this.http.post('/api/gamelist', JSON.stringify(newGame), {headers: jsonHeaders})
      .subscribe();
    }
  }

  // remove game from current user's game track list on backend
  onRemoveGame(appId: string) {
    if (this.currentUser.gameList.find(thisGame => thisGame.appId === appId)) {
      // make sure game being deleted is valid
      let updatedGameList = this.currentUser.gameList.filter(game => {
        return game.appId !== appId;
      });
      // REDIRECT TO HOME PAGE
      this.router.navigate(['news']);

      // POST TO BACKEND 
      let jsonHeaders = new Headers({
        'Content-Type': 'application/json'
      });

      this.http.delete('/api/gamelist/' + appId, {headers: jsonHeaders})
      .subscribe(res => {
        if (res.status === 200) {
          // update gameList for all components
          this.gameListSub.next(updatedGameList);
        }
      });
    }
  }

  updateGameList() {
    this.http.get('api/gamelist')
      .map((gameListRes: Response) => gameListRes.json())
      .subscribe(gameListRes => {
        this.gameListSub.next(gameListRes);
      });
  }

  getGame(appId: string) {
    if (!this.gameData.length) return {appId: '0', title: 'Game'};

    let match = this.gameData.find(thisGame => thisGame.appId === appId);
    return match;
  }

  sidebarIsOpen() {
    return this.sidebarToggleSub;
  }

  openSidebar() {
    this.sidebarToggleSub.next(true);
  }

  closeSidebar() {
    this.sidebarToggleSub.next(false);
  }

}
