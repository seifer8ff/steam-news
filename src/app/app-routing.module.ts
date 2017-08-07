import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: AllNewsListComponent},
  { path: 'news/:appId', component: GameNewsListComponent },
  { path: 'login', component: SignUpComponent },
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
