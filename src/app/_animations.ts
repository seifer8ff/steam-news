import { trigger, state, animate, transition, style, animation } from '@angular/animations';



export const fadeIn = animation([
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
]);

export const fadeInDelay = animation([
    style({ opacity: 0 }),
    animate('400ms 400ms', style({ opacity: 1 }))
]);

export const fadeOut = animation([
    style({ opacity: 1 }),
    animate('400ms', style({ opacity: 0 }))
]);



export const slideInUpLong = animation([
    style({ transformOrigin: 'top center', transform: 'translate3d(0, 100vh, 0)' }),
    animate('300ms ease-out', style({transform: 'translate3d(0, 0, 0)'}))
]);

export const slideInDown = animation([
    style({ transformOrigin: 'bottom center', transform: 'translate3d(0, -100%, 0)' }),
    style({zIndex: '-5'}),
    animate('250ms ease-in', style({transform: 'translate3d(0, 0, 0)'}))
]);

export const slideOutUp = animation([
    style({ transformOrigin: 'bottom center', transform: 'translate3d(0, 0, 0)' }),
    style({zIndex: '-5'}),
    animate('250ms ease-in', style({transform: 'translate3d(0, -100%, 0)'}))
]);

export const slideOutDownLong = animation([
    style({ transformOrigin: 'top center', transform: 'translate3d(0, 0, 0)'}),
    animate('400ms ease-in', style({transform: 'translate3d(0, 100vh, 0)'}))
]);


export const slideOutDownArticles = animation([
    style({ transformOrigin: 'top center', transform: 'translate3d(0, 0, 0)'}),
    animate('400ms ease-in', style({transform: 'translate3d(0, 100vh, 0)'}))
]);

export const slideInUpArticles = animation([
    style({ transformOrigin: 'top center', transform: 'translate3d(0, 100vh, 0)' }),
    animate('300ms ease', style({transform: 'translate3d(0, 0, 0)'}))
]);


export const slideInRight = animation([
    style({ transform: 'translate3d(-102%, 0, 0)' }),
    animate('300ms ease-in-out', style({ transform: 'translate3d(0, 0, 0)' }))
]);

export const slideOutLeft = animation([
    animate('300ms ease-in-out', style({ transform: 'translate3d(-102%, 0, 0)' }))
]);