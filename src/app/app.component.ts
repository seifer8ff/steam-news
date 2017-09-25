import { Component } from '@angular/core';
import { trigger, state, animate, transition, style, query, group, animateChild, useAnimation } from '@angular/animations';

import { UserService } from './user/user.service';
import { fadeIn, fadeOut, slideOutUp, slideOutLeft } from './_animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      // fade in on first load
      transition(':enter', [
        useAnimation(fadeIn)
      ]),
      transition('* <=> *', [
        group([
          query(':enter, :leave .anim-hide', [
            style({ opacity: 0 }),
          ], { optional: true }),
          query(':leave, :enter', [
            style({ position: 'fixed'}),
          ], { optional: true }),
        ]),
        group([
          query(':leave .title-container', [
              useAnimation(slideOutUp)
          ], { optional: true }),
          query(':leave @slideInOut', [
            useAnimation(slideOutLeft)
        ], { optional: true }),
          query(':leave:not(.anim-hide)', [
            useAnimation(fadeOut)
          ], { optional: true }),
        ]),
        query(':enter', [
          group([
            useAnimation(fadeIn),
            animateChild()
          ]),
        ])
      ]),
    ]),
  ]
})
export class AppComponent {
  title = 'app';

  constructor(private userService: UserService) {}

  prepRouteState(outlet: any) {
    return outlet.activatedRouteData.animation;
  }
}
