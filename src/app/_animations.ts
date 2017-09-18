import { trigger, state, animate, transition, style, animation } from '@angular/animations';



export const fadeInAnimation = animation([
    style({ opacity: 0 }),
    animate('400ms', style({ opacity: 1 }))
]);

export const fadeInDelayAnimation = animation([
    style({ opacity: 0 }),
    animate('400ms 600ms', style({ opacity: 1 }))
]);

export const fadeOutAnimation = animation([
    style({ opacity: 1 }),
    animate('400ms', style({ opacity: 0 }))
]);


export const slideUpAnimation = animation([
    style({transform: 'translate3d(0, 100vh, 0)'}),
    animate('500ms ease-in', style({transform: 'translate3d(0, 0, 0)'}))
]);

export const slideDownAnimation = animation([
    style({transform: 'translate3d(0, 0, 0)'}),
    animate('500ms ease-in', style({transform: 'translate3d(0, 100vh, 0)'}))
]);