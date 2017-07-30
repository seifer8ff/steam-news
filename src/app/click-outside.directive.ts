import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef : ElementRef) { }

  @Output() public appClickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target']) public onClick(targetElement) {
      const clickedInside = this.elementRef.nativeElement.contains(targetElement) || targetElement.classList.contains('click-outside');
      if (!clickedInside) {
          this.appClickOutside.emit(null);
      }
    }

}
