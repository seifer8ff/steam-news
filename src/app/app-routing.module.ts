import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: AllNewsListComponent, data: { animation: 'allNews' } },
  { path: 'news/:appId', component: GameNewsListComponent, data: { animation: 'gameNews' } },
  { path: 'login', component: SignUpComponent, data: { animation: 'login' } },
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
