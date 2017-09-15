import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class StateService {

  sidebarHidden$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }
  
    sidebarIsOpen() {
      return this.sidebarHidden$.asObservable();
    }
  
    openSidebar() {
      this.sidebarHidden$.next(false);
    }
  
    closeSidebar() {
      this.sidebarHidden$.next(true);
    }

}
