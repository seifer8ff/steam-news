import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { User } from './user';
import { Game } from './game';
import { AuthHttp } from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {
  currentUser: User = new User(
    'Demo',
    [
      { appId: '440', title: 'Team Fortress 2' },
      { appId: '211820', title: 'Starbound' }
    ]
  );
  gameList$: ReplaySubject<Game[]> = new ReplaySubject(1);
  gameData: Game[] = [];
  gameData$: ReplaySubject<Game[]> = new ReplaySubject(1);
  sidebarToggle$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loginErrorMessage: string;

  constructor(private http: Http, private router: Router, private authHttp: AuthHttp) {
    this.init();
  }

   init() {
     // get stored user for display while data is updating
     if (localStorage.getItem('currentUser')) {
       let storedUser = JSON.parse(localStorage.getItem('currentUser'));
       this.currentUser = new User(storedUser.username, storedUser.gameList);
     }

     this.loginErrorMessage = null;

     this.isLoggedIn$.next(tokenNotExpired());

     // get latest game list from backend
     this.gameList$
      .subscribe(gameList => this.currentUser.gameList = gameList);
    this.updateGameList();
    
    // get latest listing of appIds and titles from backend
    this.http.get('api/games')
      .map((gameDataRes: Response) => gameDataRes.json())
      .subscribe(gameDataRes => {
        gameDataRes = gameDataRes.filter((el) => {
          return !el.title.toLowerCase().includes('server') && 
            !el.title.toLowerCase().includes('soundtrack') &&
            !el.title.toLowerCase().includes('unstable') &&
            !el.title.toLowerCase().includes('soundtrack') &&
            !el.title.toLowerCase().includes('trailer') &&
            !el.title.toLowerCase().includes('dlc') &&
            !el.title.toLowerCase().includes('demo') &&
            !el.title.toLowerCase().includes('bundle');
        });
        this.gameData$.next(gameDataRes);
        this.gameData$.
          subscribe(gameData => this.gameData = gameData);
      });
  }

  // NEED TO REMOVE THIS OR TURN INTO OBSERVABLE (PROBABALY REMOVE)
  getUser() {
    return this.currentUser;
  }

  getGameList() {
    return this.gameList$.asObservable();
  }

  getGameData() {
    return this.gameData$.asObservable();
  }

  onAddGame(appId: string) {
    if (!this.currentUser.gameList.find(thisGame => thisGame.appId === appId)) {
      console.log('adding game to users gameList');
      var newGame = new Game(appId, this.getGame(appId).title);
      
      this.currentUser.gameList.push(newGame);
      this.gameList$.next(this.currentUser.gameList);

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
          this.gameList$.next(updatedGameList);
        }
      });
    }
  }

  // get latest game list for user from backend
  updateGameList() {
    let url = 'api/'

    if (!this.isLoggedIn()) {
      url += 'demo/gamelist'
    } else {
      url += this.currentUser.username + '/gamelist';
    }
    this.authHttp.get(url)
      .map((res: Response) => {
        return res;
      })
      .map((gameListRes: Response) => gameListRes.json())
      .subscribe(gameListRes => {
        this.gameList$.next(gameListRes);
      });
  }

  // find game by appId (typically used to find game title by appId)
  getGame(appId: string) {
    if (!this.gameData.length) return {appId: '0', title: 'Game'};

    let match = this.gameData.find(thisGame => thisGame.appId === appId);
    return match;
  }


  // AUTH --------------------------------------------

  register(username: string, password: string) {
    let user = { username: username, password: password };
    let jsonHeaders = new Headers({
      'Content-Type': 'application/json'
    });

    this.http.post('/api/register', JSON.stringify(user), {headers: jsonHeaders})
      .map(res => res.json())
      .subscribe(resObj => {
        this.currentUser = resObj.user;
        localStorage.setItem('currentUser', JSON.stringify(resObj.user));
        localStorage.setItem('token', resObj.token);
        this.init();
        this.router.navigate(['news']);
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
      .subscribe(
        data => { 
          console.log(data);
          this.currentUser = data.user;
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          this.init();
          this.router.navigate(['news']);
        }, err => {
          if (err.status === 401) {
            this.loginErrorMessage = "Incorrect Login Information"
          }
        }
      )
  }

  logOut() {
    localStorage.clear();
    this.init();
    this.router.navigate(['news']);
  }

  isLoggedIn() {
    return this.isLoggedIn$.asObservable();
  }



  // SIDEBAR ----------------------
  
  sidebarIsOpen() {
    return this.sidebarToggle$.asObservable();
  }

  openSidebar() {
    this.sidebarToggle$.next(true);
  }

  closeSidebar() {
    this.sidebarToggle$.next(false);
  }

}
