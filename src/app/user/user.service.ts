import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Http, Headers, Response } from '@angular/http';

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
  sidebarToggleSub: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private http: Http) {
    this.init();
  }

   init() {
    this.http.get('api/gamelist')
      .map((gameListRes: Response) => gameListRes.json())
      .subscribe(gameListRes => {
        // this.currentUser.gameList = gameListRes;
        this.gameListSub.next(gameListRes);
        this.gameListSub.
          subscribe(gameList => this.currentUser.gameList = gameList);
      });
    
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
      .subscribe()
    }
  }

  getGame(appId: string) {
    if (!this.gameData.length) return {appId: '0', title: 'Game'};

    let match = this.gameData.find(thisGame => thisGame.appId === appId);
    return match;
  }

  sidebarIsOpen() {
    return this.sidebarToggleSub;
  }

  toggleSidebar() {
    this.sidebarToggleSub.next(!this.sidebarToggleSub.getValue())
  }

}
