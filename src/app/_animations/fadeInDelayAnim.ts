import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeInDelayAnimation =
   trigger('fadeInDelayAnimation', [
       transition(':enter', [
           style({ opacity: 0 }),
           
           animate('.5s 600ms', style({ opacity: 1 }))
       ]),
       transition(':leave', [
        style({ opacity: 1 }),
        
        animate('.5s', style({ opacity: 0 }))
    ]),
   ]);