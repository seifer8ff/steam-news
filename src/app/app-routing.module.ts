import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { GameListComponent } from './user/game-list/game-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: AllNewsListComponent, children: [
    { path: '', component: GameListComponent }
  ] },
  { path: 'news/:appId', component: GameNewsListComponent },
  { path: '**', component: GameNewsListComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
