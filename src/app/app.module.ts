import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NewsComponent } from './news/news.component';
import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { NewsArticleComponent } from './news/news-article/news-article.component';
import { NewsService } from './news/news.service';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { NewsSummaryComponent } from './news/news-summary/news-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    AllNewsListComponent,
    NewsArticleComponent,
    GameNewsListComponent,
    NewsSummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
