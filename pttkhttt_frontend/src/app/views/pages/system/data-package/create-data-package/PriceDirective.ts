import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[ktPrice]'
})
export class PriceDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^[0-9]+\.?\d{0,2}$/g);
  private regex1: RegExp = new RegExp(/^[0-9\.]$/);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete','Control'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // console.log(this.el.nativeElement.value);
    if (this.specialKeys.indexOf(event.key) !== -1) {
        return;
    }

    if (event.ctrlKey) {
        if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'c' || event.key.toLowerCase() === 'v') {
            return;
        }
    }

    if(!(event.key.match(this.regex1))){
        event.preventDefault();
    }
    // Allow Backspace, tab, end, and home keys
    let current: string = this.el.nativeElement.value;
    current = current.split(",").join("");
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    console.log('current',current);
    console.log('next',next)
    if(!String(next).match(this.regex)){
        event.preventDefault();
    }
    // if (next && !String(next).match(this.regex)) {
    //   event.preventDefault();
    // }
  }
}
