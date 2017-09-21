import { Directive, ElementRef, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  scrollPos = 0;

  constructor(private elementRef : ElementRef) {}

  @Output() public appClickOutside = new EventEmitter();

    @HostListener('document:click', ['$event'])
    @HostListener('document:touchend', ['$event'])
    @HostListener('document:touchstart', ['$event'])
    handleClick(event) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target) || this.elementRef.nativeElement.parentElement.contains(event.target) || event.target.classList.contains('click-outside');
      if (!clickedInside) {
          this.appClickOutside.emit(null);
          event.preventDefault();
      }
    }

    ngOnInit() {
      this.scrollPos = document.body.scrollTop;
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
      document.body.style.marginTop = -this.scrollPos + 'px';
    }

    ngOnDestroy() {
      document.body.style.overflow = "auto";
      document.body.style.position = "relative";
      document.body.style.marginTop = '0';
      document.body.scrollTop = this.scrollPos;
    }
}
