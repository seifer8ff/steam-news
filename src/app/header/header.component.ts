import { Component, OnInit } from '@angular/core';

import { UserService } from '../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  openDropdown(event) {
    if (window.innerWidth <= 768 && event.target.firstElementChild) {
      event.target.classList.toggle("hover");
      event.target.firstElementChild.classList.toggle("open");
    }
  }

}
