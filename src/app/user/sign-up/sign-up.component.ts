import { Component, OnInit, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation,
  query
} from '@angular/animations';

import { UserService } from '../user.service';
import { slideUpAnimation, slideDownAnimation } from '../../_animations';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('componentAnimations', [
      transition(':enter', [
        query('.content-container', [
          useAnimation(slideUpAnimation)
        ])
      ]),
      transition(':leave', [
        query('.content-container', [
          useAnimation(slideDownAnimation)
        ])
      ]),
    ]),
    trigger('flipAnimation', [
      transition(':enter', [
        style({transform: 'rotateY(179.9deg)'}),
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class SignUpComponent implements OnInit {
  @HostBinding('@componentAnimations')
  newUser: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onSignup(form: any) {
    this.userService.register(form.registerUsername, form.registerPassword);
  }

  onLogin(form: any) {
    this.userService.logIn(form.loginUsername, form.loginPassword);
  }

}
