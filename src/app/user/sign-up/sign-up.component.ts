import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('newUser', [
      transition(':enter', [
        style({transform: 'rotateY(179.9deg)'}),
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class SignUpComponent implements OnInit {
  newUser: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onSignup(form: any) {
    this.userService.register(form.username, form.password);
  }

  onLogin(form: any) {
    this.userService.logIn(form.username, form.password);
  }

}
