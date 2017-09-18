import { Component } from '@angular/core';
import { trigger, state, animate, transition, style, query, group, animateChild, useAnimation } from '@angular/animations';

import { UserService } from './user/user.service';
import { fadeIn, fadeOut } from './_animations';

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
          query(':enter', [
            style({ opacity: 0 }),
          ], { optional: true }),
          query(':leave, :enter', [
            style({ position: 'absolute', display: 'block', top: 0, left: 0, right: 0, width: '100vw' }),
          ], { optional: true }),
        ]),
        query(':leave', [
          group([
            animateChild(),
            useAnimation(fadeOut)
          ])
        ], { optional: true }),
        query(':enter', [
          group([
            useAnimation(fadeIn),
            animateChild()
          ])
        ], { optional: true }),
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
