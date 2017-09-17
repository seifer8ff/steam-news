import { Component } from '@angular/core';
// import { trigger, state, animate, transition, style, query, group, animateChild } from '@angular/animations';

import { UserService } from './user/user.service';
import { fadeInAnimation } from './_animations/fadeInAnim';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation],
  // host: { '[@fadeInAnimation]': '' }
  // animations: [
  //   trigger('routeAnimation', [
  //     // fade in on first load
  //     transition(':enter', [
  //       style({ opacity: '0' }),
  //       animate('0.5s', style({ opacity: '1' }))
  //     ]),
  //     // SWIPE RIGHT EFFECT ON ROUTE TRANSITION
  //     transition('* <=> *', [
  //       query(':leave', style({ position: 'absolute', top: 0, left: 0 })),
  //       query(':enter', style({ position: 'absolute', top: 0, right: 0 })),
  //       query(':enter', style({ transform: 'translate3d(100%, 0, 0)' })),
  //       group([
  //         query(':leave', [
  //           animate('0.8s', style({ transform: 'translate3d(-100%, 0, 0)' })),
  //           style({ display: 'none' })
  //         ]),
  //         query(':enter', animate('0.8s', style({ transform: 'translate3d(0, 0, 0)' })))
  //       ])
  //     ])
  //     // SLIDE UP EFFECT ON ROUTE TRANSITION
  //     transition('allNews => gameNews', [
  //       query(':leave', style({ position: 'absolute', top: 0, left: 0, zIndex: '-5', opacity: 1 })),
  //       query(':enter', style({ zIndex: '5' })),
  //       query(':enter', style({ transform: 'translate3d(0, 100vh, 0)' })),
  //       group([
  //         query(':enter', animate('0.3s', style({ transform: 'translate3d(0, 0, 0)' }))),
  //         query(':leave', animate('0.3s', style({ opacity: 0 })))
  //       ])
  //     ]),
  //     transition('gameNews => allNews', [
  //       query(':leave', style({ position: 'absolute', top: 0, left: 0, zIndex: '-5', opacity: 1 })),
  //       query(':enter', style({ zIndex: '5' })),
  //       query(':enter', style({ position: 'absolute', bottom: 0, left: 0, zIndex: '5' })),
  //       query(':enter', style({ transform: 'translate3d(0, 100vh, 0)' })),
  //       group([
  //         query(':enter', animate('0.3s', style({ transform: 'translate3d(0, 0, 0)' }))),
  //         query(':leave', animate('0.3s', style({ opacity: 0 })))
  //       ])
  //     ])
  //   ])
  // ]
})
export class AppComponent {
  title = 'app';

  constructor(private userService: UserService) {}

  // prepRouteState(outlet: any) {
  //   console.log(outlet.activatedRouteData.state);
  //   return outlet.activatedRouteData.state;
  // }
}
