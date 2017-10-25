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
      transition('* <=> *', [
        group([
          query(':leave, :enter', [
            style({ position: 'fixed', width: '100vw', opacity: 0 }),
          ], { optional: true })
        ]),
        query(':enter', [
          group([
            useAnimation(fadeIn),
            animateChild()
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  title = 'app';

  constructor(private userService: UserService) {}

  prepRouteState(outlet: any) {
    return outlet.activatedRouteData.animation;
  }
}
