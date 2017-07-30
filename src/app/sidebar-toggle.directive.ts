import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

import { UserService } from './user/user.service';

@Directive({
    selector: '[appSidebarToggle]'
})
export class SidebarToggleDirective {
    sidebar: ElementRef;

    constructor(private userService: UserService) {}

    @HostListener('click') toggleSidebar() {
        this.userService.toggleSidebar();
    }
}