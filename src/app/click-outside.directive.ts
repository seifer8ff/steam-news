import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef : ElementRef) { }

  @Output() public appClickOutside = new EventEmitter();

    @HostListener('document:click', ['$event'])
    @HostListener('document:touchend', ['$event'])
    handleClick(event) {
      console.log('clicked or touched');
      console.log(event.target);
      const clickedInside = this.elementRef.nativeElement.contains(event.target) || event.target.classList.contains('click-outside');
      if (!clickedInside) {
          this.appClickOutside.emit(null);
          event.preventDefault();
      }
    }

    @HostListener('document:touchmove', ['$event']) handleScroll(event) {
      event.preventDefault();
    }
}
