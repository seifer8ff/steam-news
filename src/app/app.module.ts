import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

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
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { AuthModule } from './auth.module';
import { SearchComponent } from './user/sidebar-games/search/search.component';
import { BrokenImageDirective } from './broken-image.directive';
import { StateService } from './state.service';
import { StripTagPipe } from './stripTag.pipe';
import { ArticleLoaderService } from './news/game-news-list/article-loader.service';

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
    ShortenPipe,
    SignUpComponent,
    SearchComponent,
    BrokenImageDirective,
    StripTagPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule
  ],
  providers: [StateService, UserService, NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
