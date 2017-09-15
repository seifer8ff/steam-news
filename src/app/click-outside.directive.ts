import { Directive, ElementRef, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnInit, OnDestroy {

  constructor(private elementRef : ElementRef) {}

  content = <HTMLElement>document.querySelector(".content");

  @Output() public appClickOutside = new EventEmitter();

    @HostListener('document:click', ['$event'])
    @HostListener('document:touchend', ['$event'])
    handleClick(event) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target) || this.elementRef.nativeElement.parentElement.contains(event.target) || event.target.classList.contains('click-outside');
      if (!clickedInside) {
          this.appClickOutside.emit(null);
          event.preventDefault();
      }
    }

    ngOnInit() {
      this.content.style.overflowY = "hidden";
    }

    ngOnDestroy() {
      this.content.style.overflowY = "auto";
    }
}
