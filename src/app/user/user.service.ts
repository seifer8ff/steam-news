import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { User } from './user';
import { Game } from './game';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
  currentUser: User = new User(
    'Test User',
    [
      { appId: '440', title: 'Team Fortress 2' },
      { appId: '211820', title: 'Starbound' }
    ],
    null
  );
  gameData: Game[] = [];
  gameListSub: ReplaySubject<Game[]> = new ReplaySubject(1);
  gameDataSub: ReplaySubject<Game[]> = new ReplaySubject(1);
  sidebarToggleSub: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: Http, private router: Router, private authHttp: AuthHttp) {
    this.init();
  }

   init() {
     if (localStorage.getItem('currentUser')) {
       let storedUser = JSON.parse(localStorage.getItem('currentUser'));
       this.currentUser = new User(storedUser.username, storedUser.gameList, storedUser.token);
     }

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

      this.authHttp.post('/api/' + this.currentUser.username + '/gamelist', JSON.stringify(newGame), {headers: jsonHeaders})
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
      this.authHttp.delete('/api/' + this.currentUser.username + '/gamelist/' + appId)
      .subscribe(res => {
        if (res.status === 200) {
          // update gameList for all components
          this.gameListSub.next(updatedGameList);
        }
      });
    }
  }

  updateGameList() {

    this.authHttp.get('api/' + this.currentUser.username + '/gamelist')
      .map((res: Response) => {
        console.log(res);
        return res;
      })
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

  register(username: string, password: string) {
    console.log("signing up with");
    console.log(username + " " + password);

    let user = { username: username, password: password };

    let jsonHeaders = new Headers({
      'Content-Type': 'application/json'
    });

    this.http.post('/api/register', JSON.stringify(user), {headers: jsonHeaders})
      .map(res => res.json())
      .subscribe(userObj => {
        console.log(userObj);
        localStorage.setItem('currentUser', JSON.stringify(userObj));
      });
  }

  logIn(username: string, password: string) {
    console.log('logging in with');
    console.log(username + " " + password);

    let user = { username: username, password: password };

    let jsonHeaders = new Headers({
      'Content-Type': 'application/json'
    });

    this.http.post('/api/login', JSON.stringify(user), {headers: jsonHeaders})
      .map(res => res.json())
      .subscribe(userObj => {
        console.log(userObj);
        localStorage.setItem('currentUser', JSON.stringify(userObj));
      });
  }



  // SIDEBAR ----------------------
  
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
