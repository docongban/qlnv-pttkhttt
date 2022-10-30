import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {TimekeepingComponent} from '../timekeeping.component';
import {TimekeepingService} from '../../../../../core/service/service-model/timekeeping.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CreateUpdateTimekeepingComponent} from '../create-update-timekeeping/create-update-timekeeping.component';

@Component({
  selector: 'kt-action-timekeeping',
  templateUrl: './action-timekeeping.component.html',
  styleUrls: ['./action-timekeeping.component.scss']
})
export class ActionTimekeepingComponent implements OnInit {

  rowIndex;
  cellValue: string;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private matDialog : MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private timekeepingComponent: TimekeepingComponent,
    private timekeepingService: TimekeepingService,
    private toaStr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    // set value into cell again
    return true
  }

  openModalUpdate(){
    const dataEdit : any = {};
    dataEdit.isCreateNew = false;
    dataEdit.oldData = this.cellValue;
    this.matDialog.open(
      CreateUpdateTimekeepingComponent,{
        data: dataEdit,
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '550px',
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      if(res.event !== 'cancel'){
        this.timekeepingComponent.search(1);
      }
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-offical' })
    );
  }

  deleteTimeKeeping(){
    this.timekeepingService.handleDelete(this.cellValue).subscribe(res => {
      // tslint:disable-next-line:triple-equals
      if(res.status == 'OK'){
        this.toaStr.success(res.message);
        // tslint:disable-next-line:triple-equals
        if(this.timekeepingComponent.totalRecord % 10 == 1 && this.timekeepingComponent.page == this.timekeepingComponent.totalPage){
          this.timekeepingComponent.search(1);
        }else{
          this.timekeepingComponent.search(this.timekeepingComponent.page);
        }
        this.modalRef.hide();
      } else {
        this.modalRef.hide();
        this.toaStr.error(res.message);
        this.timekeepingComponent.search(this.timekeepingComponent.page);
      }
    })
  }

}
