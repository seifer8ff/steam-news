import { Injectable } from '@angular/core';

import { News } from './news';

@Injectable()
export class NewsService {
  allNews: News[] = [
    new News('Kingdoms and Castles V1.1', 'Kingdoms and Castles has been updated to version 1.1! New features include: improvements to...'),
    new News('Star Citizen Hotfix 3.03', 'Hotfix released to fix save bug.')
  ];

  constructor() { }

  getAllNews() {
    return this.allNews.slice();
  }

}
