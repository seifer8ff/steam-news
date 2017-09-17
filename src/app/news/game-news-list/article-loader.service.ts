import { Injectable, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ArticleLoaderService implements OnInit, OnDestroy {
  container = <HTMLElement>document.querySelector(".content");
  watchComponent: ElementRef;
  scrollStream$: Subscription;
  minArticlesDisplay: number = 3;
  maxArticlesDisplay: number = this.minArticlesDisplay;
  maxArticlesDisplay$: BehaviorSubject<number> = new BehaviorSubject(this.minArticlesDisplay);
  

  constructor() { 
    this.scrollStream$ = Observable.fromEvent(this.container, 'scroll')
    .throttleTime(200)
    .subscribe(() => {
      this.isVisible(this.watchComponent, this.container);
    });
   }

  ngOnInit() {
  }

  updateWatchComponent(elRef: ElementRef) {
    this.watchComponent = elRef;
    console.log('watching ');
    console.log(this.watchComponent);
  }

  isVisible(el, container) {
    let elRect = el.nativeElement.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    elRect = {
      top: elRect.top, 
      bottom: elRect.bottom,
      height: elRect.height,
      visibleHeight: elRect.height,
      isVisible: true,
      isContained: true
    }

    elRect.top = Math.max(elRect.top, containerRect.top);
    elRect.bottom = Math.min(elRect.bottom, containerRect.bottom);

    elRect.visibleHeight = Math.max(0, elRect.bottom - elRect.top);
    elRect.isVisible = elRect.visibleHeight > 0;
    elRect.isContained = elRect.visibleHeight === elRect.height;

    if (elRect.isVisible) {
      this.updateMaxArticlesDisplay(this.maxArticlesDisplay+2);
    }

  }

  getMaxArticlesDisplay() {
    return this.maxArticlesDisplay$.asObservable();
  }

  updateMaxArticlesDisplay(newMax: number) {
    if (newMax > this.maxArticlesDisplay) {
      this.maxArticlesDisplay = newMax;
      this.maxArticlesDisplay$.next(this.maxArticlesDisplay);
    }
  }

  resetMaxArticlesDisplay() {
    this.maxArticlesDisplay = this.minArticlesDisplay;
    this.maxArticlesDisplay$.next(this.maxArticlesDisplay);
  }

  ngOnDestroy() {
    this.scrollStream$.unsubscribe();
  }

}
