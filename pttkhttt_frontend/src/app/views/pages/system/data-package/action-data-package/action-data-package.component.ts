import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {DataPackageService} from 'src/app/core/service/service-model/data-package.service';
import {MatDialog} from '@angular/material/dialog';
import {DataPackageComponent} from '../data-package.component';
import {CreateDataPackageComponent} from '../create-data-package/create-data-package.component';
import {ApParamService} from "../../../../../core/service/service-model/ap-param.service";

@Component({
  selector: 'kt-action-data-package',
  templateUrl: './action-data-package.component.html',
  styleUrls: ['./action-data-package.component.scss']
})
export class ActionDataPackageComponent implements OnInit {

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
              private matDialog: MatDialog,
              private dataPackageService: DataPackageService,
              private toastr: ToastrService,
              private changeDetectorRef: ChangeDetectorRef,
              private dataPackage: DataPackageComponent,
              private apParamService: ApParamService
  ) {
    this.language = localStorage.getItem('language');
  }

  rowIndex;
  cellValue: string;
  listService = [];
  language: string;

  ngOnInit(): void {
    this.apParamService.getAllByTypeDataPackageService(this.language).subscribe((res) => {
      this.listService = res;
    })
    this.changeDetectorRef.detectChanges();
  }

  agInit(params): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

// gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md fix-width'})
    );
  }

  deleteDocument() {
    console.log('cellValue', this.cellValue);
    this.dataPackageService.delete(this.cellValue)
      .subscribe(responseAPI => {
        console.log('aaa', responseAPI);
        if (responseAPI.status === 'OK') {
          if (this.dataPackage.totalRecord % 10 == 1 && this.dataPackage.page == this.dataPackage.totalPage) {
            this.dataPackage.search(1);
          } else {
            this.dataPackage.search(this.dataPackage.page);
          }
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
        }
      });
  }

  openModalUpdate() {
    console.log(this.cellValue);
    const dataEdit: any = {};
    dataEdit.action = 'edit';
    dataEdit.listLevelSchool = this.dataPackage.levelSchool;
    dataEdit.isCreateNew = false;
    dataEdit.oldData = this.cellValue;
    dataEdit.listService = this.listService;
    console.log('cell-value', this.cellValue);
    this.matDialog.open(CreateDataPackageComponent, {
      data: dataEdit,
      maxHeight: '90vh',
      disableClose: true,
      hasBackdrop: true,
      width: '860px',
      autoFocus: false
    }).afterClosed().subscribe((res) => {
      console.log(res);
      if (res.event != 'cancel') {
        this.dataPackage.search(1);
      }
    });
  }

}
