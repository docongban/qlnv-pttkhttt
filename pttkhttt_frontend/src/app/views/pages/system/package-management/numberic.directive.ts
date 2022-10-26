import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[ktNumberic]'
})
export class NumbericDirective {
  // private regex: RegExp = new RegExp(/^[0-9]$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  private regex: RegExp = new RegExp(/^[A-Za-z {}_<>/:\\?.,~\[\]"'+=|)(;\-!@#$%^&*aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]$/g);

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(event);
    const regex: RegExp = new RegExp(/^[0-9/]$/g);
    const array = ["0","1", "2", "3", "4","5","6","7","8","9","/","Backspace","ArrowLeft","ArrowRight","Home","End","Delete","Tab"];
    if(!array.includes(event.key)){
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    // return !regex.test(event.key);
  }
}
