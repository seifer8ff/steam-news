import { trigger, state, animate, transition, style } from '@angular/animations';
 
export const slideRightAnimation =
    trigger('slideRightAnimation', [
        transition(':enter', [
            style({
                transform: 'translate3d(-110%, 0, 0)',
            }),
            animate('1s ease-in-out', style({
                transform: 'translate3d(0, 0, 0)',
            }))
        ]),
        transition(':leave', [
            animate('.5s ease-in-out', style({
                transform: 'translate3d(110%, 0, 0)',
            }))
        ])
    ]);