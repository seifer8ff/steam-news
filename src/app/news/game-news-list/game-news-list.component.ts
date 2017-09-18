import { Component, OnInit, OnDestroy, AfterViewInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, animate, transition, style, query, group, animateChild, useAnimation } from '@angular/animations';

import { NewsService } from '../news.service';
import { UserService } from '../../user/user.service';
import { ArticleLoaderService } from './article-loader.service';
import { News } from '../news';
import { fadeIn, slideInUpLong, slideOutDownLong, slideInDown, slideOutUp } from '../../_animations';

@Component({
  selector: 'app-game-news-list',
  templateUrl: './game-news-list.component.html',
  styleUrls: ['./game-news-list.component.css'],
  providers: [ArticleLoaderService],
  animations: [
    trigger('componentAnimations', [
      transition(':enter', [
        query('.title-container', [
          useAnimation(slideInDown)
        ], { optional: false }),
        query('h1', [
          useAnimation(fadeIn)
        ], { optional: true }),
        query('@slideRight', [
          animateChild()
        ], { optional: true }),
        query('app-news-article', [
          useAnimation(slideInUpLong)
        ], { optional: true }),
      ]),
      transition(':leave', [
        query('app-news-article', [
          useAnimation(slideOutDownLong)
        ], { optional: true }),
        query('@slideRight', [
          animateChild()
        ], { optional: true }),
        query('.title-container', [
          useAnimation(slideOutUp)
        ], { optional: false }),
      ])
    ]),
    trigger('slideRight', [
        transition(':enter', [
            style({
              transform: 'translate3d(-102%, 0, 0)'
            }),
            animate('500ms ease-in-out', style({
              transform: 'translate3d(0, 0, 0)'
            }))
        ]),
        transition(':leave', [
          animate('500ms ease-in-out', style({
            transform: 'translate3d(-102%, 0, 0)'
          }))
        ])
    ])
  ]
})
export class GameNewsListComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('@componentAnimations')

  appId: string;
  fragment: string;
  noNews: boolean = false;
  gameNews: News[] = [];
  gameNews$: Subscription;
  maxArticles: number = 20; // controls how many articles get requested from server
  maxArticlesDisplay: number; // this value gets set by article loader service
  maxArticlesDisplay$: Subscription;

  constructor(public newsService: NewsService, 
    public userService: UserService, 
    private articleLoaderService: ArticleLoaderService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      this.newsService.clearGameNews();
      this.appId = params['appId'];
      this.onRouteChange();
    });

    // update the number of articles being displayed
    this.maxArticlesDisplay$ = this.articleLoaderService.getMaxArticlesDisplay().subscribe(max => {
      this.maxArticlesDisplay = max;
    });

    // scroll to fragment if in url
    this.route.fragment.subscribe ( (f: string) => {
      if (f) {
        let fragArr = f.split('&');
        let newMaxArticlesDisplay = Number(fragArr[1].split('-')[1]) + 1;
        this.fragment = fragArr[0];

        if (newMaxArticlesDisplay > this.maxArticlesDisplay) {
          this.articleLoaderService.updateMaxArticlesDisplay(newMaxArticlesDisplay);
        }
        
        // need to wait a moment for the articles to load
        setTimeout(this.scrollToFragment.bind(this), 500);
        
      }
    });
  }

  ngAfterViewInit() {
    let scrollContainer = document.querySelector('#scrollContainer');
    this.articleLoaderService.watchScroll(scrollContainer);
  }

  //runs every time the game selected changes
  onRouteChange() {
    console.log('route changed');

    // controls whether the "there is no news" message is displayed
    this.noNews = false;
    setTimeout(() => {
      if (!this.gameNews || !this.gameNews.length) {
        this.noNews = true;
      }
    }, 1000);

    document.querySelector(".title-container").scrollIntoView();

    // get news for appId every time it changes
    this.articleLoaderService.resetMaxArticlesDisplay();
    if (this.gameNews$) {
      this.gameNews$.unsubscribe(); // destroy old stream with old appId
    }
    // create new news stream with updated appId
    this.gameNews$ = this.newsService.getGameNews(this.appId, this.maxArticles)
    .subscribe(news => {
      this.gameNews = news;
    });
  }

  scrollToFragment() {
    console.log('scrolling to ' + this.fragment);
    let element = document.querySelector ( "#" + this.fragment );
    if (element) element.scrollIntoView();
  }

  goToArticle(articleIndex, articleId) {
    let newMax = articleIndex + 1;
    let fragment = 'a-' + articleId + '&i-' + articleIndex;

    if (newMax > this.maxArticlesDisplay) {
      this.articleLoaderService.updateMaxArticlesDisplay(newMax);
    }

    this.router.navigate([], { fragment: fragment });
  }


  ngOnDestroy() {
    this.newsService.clearGameNews();
    this.gameNews$.unsubscribe();
    this.maxArticlesDisplay$.unsubscribe();
  }

}
