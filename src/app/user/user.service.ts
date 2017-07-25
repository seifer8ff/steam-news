import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http, Headers, Response } from '@angular/http';

import { User } from './user';

@Injectable()
export class UserService {
  currentUser: User = new User(
    'Test User',
    [
      '440',
      '361420'
    ]
  );
  gameList: ReplaySubject<string[]> = new ReplaySubject(1);

  constructor(private http: Http) {
    this.init()
  }

   init() {
    this.http.get('api/games')
    .map((gameList: Response) => gameList.json())
    .subscribe(gameList => {
      this.currentUser.gameList = gameList;
      this.gameList.next(gameList);
      this.gameList.
      subscribe(gameList => this.currentUser.gameList = gameList);
    });
  }

  getUser() {
    return this.currentUser;
  }

  getGameList() {
    return this.gameList;
  }

  onAddGame(appId: string) {
    if (!this.currentUser.gameList.find(thisAppId => thisAppId === appId)) {
      this.currentUser.gameList.push(appId);
      this.gameList.next(this.currentUser.gameList);

      let jsonHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      let postBody = {
        appId: appId
      }
      this.http.post('/api/games', JSON.stringify(postBody), {headers: jsonHeaders})
      .subscribe()
    }
  }

}
