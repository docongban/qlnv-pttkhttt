import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'kt-transfer-student-header',
  templateUrl: './transfer-student-header.component.html',
  styleUrls: ['./transfer-student-header.component.scss']
})
export class TransferStudentHeaderComponent {
  @Input() isShowTransferButton: boolean;
  @Input() isShowExportButton: boolean;
  @Output() transferClicked = new EventEmitter<void>();
  @Output() exportClicked = new EventEmitter<void>();
}
