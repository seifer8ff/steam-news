import { Injectable } from '@angular/core';

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

  constructor() { }

  getUser() {
    return this.currentUser;
  }

  getAllGames() {
    return this.currentUser.gameList.slice();
  }

}
