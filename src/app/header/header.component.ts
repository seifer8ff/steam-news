import { Component, OnInit, ElementRef } from '@angular/core';

import { StateService } from '../user/../state.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService, public stateService: StateService, private elementRef: ElementRef) { }

  ngOnInit() {
  }

  openDropdown(event) {
    if (window.innerWidth <= 768 && event.target.firstElementChild) {
      event.target.classList.toggle("hover");
      event.target.firstElementChild.classList.toggle("open");
    }
  }

  handleTouch(event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target) && !event.target.classList.contains("header-item");
    if (clickedInside) {
        document.body.scrollTop = 0;
    }
  }

}
