import {Component, OnDestroy} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'kt-cell-renderer',
  template: `
    <div style="transform: scale(0.8)" class="mt-3" (click)="btnClickedHandler()">
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2871 3.24297C17.6761 3.24297 18 3.56596 18 3.97696V4.35696C18 4.75795 17.6761 5.09095 17.2871 5.09095H0.713853C0.32386 5.09095 0 4.75795 0 4.35696V3.97696C0 3.56596 0.32386 3.24297 0.713853 3.24297H3.62957C4.22185 3.24297 4.7373 2.82197 4.87054 2.22798L5.02323 1.54598C5.26054 0.616994 6.0415 0 6.93527 0H11.0647C11.9488 0 12.7385 0.616994 12.967 1.49699L13.1304 2.22698C13.2627 2.82197 13.7781 3.24297 14.3714 3.24297H17.2871ZM15.8057 17.1338C16.1101 14.2968 16.6431 7.5569 16.6431 7.4889C16.6625 7.28291 16.5954 7.08791 16.4622 6.93091C16.3192 6.78391 16.1383 6.69691 15.9389 6.69691H2.0684C1.86805 6.69691 1.67743 6.78391 1.54516 6.93091C1.41095 7.08791 1.34482 7.28291 1.35454 7.4889C1.35633 7.5014 1.37545 7.73881 1.40743 8.13572C1.54946 9.89896 1.94504 14.8099 2.20066 17.1338C2.38156 18.8458 3.50486 19.9218 5.13194 19.9608C6.3875 19.9898 7.681 19.9998 9.00367 19.9998C10.2495 19.9998 11.5148 19.9898 12.8093 19.9608C14.4928 19.9318 15.6151 18.8748 15.8057 17.1338Z" fill="#D14343"/>
      </svg>
    </div>
  `,
})
export class BtnCellRendererComponent implements ICellRendererAngularComp, OnDestroy {
  private params: any;
  agInit(params: any): void {
    this.params = params;
  }
  btnClickedHandler() {
    this.params.clicked(this.params);
  }
  ngOnDestroy() {
    // no need to remove the button click handler as angular does this under the hood
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
