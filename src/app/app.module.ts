import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AllNewsListComponent } from './news/all-news-list/all-news-list.component';
import { NewsArticleComponent } from './news/game-news-list/news-article/news-article.component';
import { NewsService } from './news/news.service';
import { GameNewsListComponent } from './news/game-news-list/game-news-list.component';
import { NewsSummaryComponent } from './news/news-summary/news-summary.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './user/user.service';
import { SidebarGamesComponent } from './user/sidebar-games/sidebar-games.component';
import { FirstElementPipe } from './first-element.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ShortenPipe } from './shorten.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AllNewsListComponent,
    NewsArticleComponent,
    GameNewsListComponent,
    NewsSummaryComponent,
    SidebarGamesComponent,
    FirstElementPipe,
    HeaderComponent,
    FooterComponent,
    ClickOutsideDirective,
    ShortenPipe
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
