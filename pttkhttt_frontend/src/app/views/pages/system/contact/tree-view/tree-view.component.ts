import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'kt-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnChanges {
  @Input() config: any = {};
  @Input() items: any;
  @Input() selectAllTitle: any = '';
  @Output() valueChange = new EventEmitter<any>();
  filterText: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onFilterChange($event: string) {

  }

  selectedChange($event: any[]) {
    this.valueChange.emit($event);
  }

  shouldShowCheckbox(item): boolean {
    if (this.config?.selectByGroupValue) {
      return item.value?.isRoot;
    }
    return item.value?.isTeacher;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

}
