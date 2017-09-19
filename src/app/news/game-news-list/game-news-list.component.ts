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
        ], { optional: true }),
        query('h1', [
          useAnimation(fadeIn)
        ], { optional: true }),
        query('@slideRight', [
          animateChild()
        ], { optional: true }),
        query('#article-container', [
          useAnimation(slideInUpLong)
        ], { optional: true }),
      ]),
      transition(':leave', [
        group([
          query('#article-container', [
            useAnimation(slideOutDownLong)
          ], { optional: true }),
          query('@slideRight', [
            animateChild()
          ], { optional: true }),
        ]),
        query('.title-container', [
          useAnimation(slideOutUp)
        ], { optional: true }),
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
      this.appId = params['appId'];

      document.querySelector(".title-container").scrollIntoView();
      this.gameNews$ = this.newsService.getGameNews(this.appId, this.maxArticles)
      .subscribe(news => {
        this.gameNews = news;
      });
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

  scrollToFragment() {
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
    this.articleLoaderService.resetMaxArticlesDisplay();
    this.gameNews$.unsubscribe();
    this.maxArticlesDisplay$.unsubscribe();
  }

}
