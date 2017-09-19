import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AllNewsListComponent, data: { animation: 'allNews' } },
  { path: 'login', component: SignUpComponent, data: { animation: 'login' } },
  { path: 'games/:appId', component: GameNewsListComponent, data: { animation: 'gameNewsAlt' } }, // second route for animation purposes
  { path: ':appId', component: GameNewsListComponent, data: { animation: 'gameNews' } },
  { path: '**', component: AllNewsListComponent }
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
