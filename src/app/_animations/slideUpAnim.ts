import { trigger, state, animate, transition, style } from '@angular/animations';
 
export const slideUpAnimation =
    trigger('slideUpAnimation', [
        transition(':enter', [
          style({transform: 'translateY(110vh)'}),
          animate('0.3s ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-in', 
          style({transform: 'translateY(110vh)'}))
        ])
      ]);