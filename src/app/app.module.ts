import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { NewsArticleComponent } from './news/news-article/news-article.component';
import { NewsService } from './news/news.service';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { NewsSummaryComponent } from './news/news-summary/news-summary.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './user/user.service';
import { GameListComponent } from './user/game-list/game-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AllNewsListComponent,
    NewsArticleComponent,
    GameNewsListComponent,
    NewsSummaryComponent,
    GameListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [UserService, NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
