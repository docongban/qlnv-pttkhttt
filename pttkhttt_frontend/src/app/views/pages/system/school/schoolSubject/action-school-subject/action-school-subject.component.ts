import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import { SchoolSubjectComponent } from '../school-subject.component';
import {SubjectService} from '../../../../../../core/service/service-model/subject.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'kt-action-school-subject',
  templateUrl: './action-school-subject.component.html',
  styleUrls: ['./action-school-subject.component.scss']
})
export class ActionSchoolSubjectComponent implements OnInit, ICellRendererAngularComp {


  @ViewChild('templateNewSubject') public newSubject: ModalDirective;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
              private schoolSubjectComponent: SchoolSubjectComponent,
              private subjectService: SubjectService,
              private toastr: ToastrService,
  ) {  }

  SchoolSubjectComponent
  rowIndex;
  cellValue: string;

  ngOnInit() {
  }

  // gets called once before the renderer is used
  agInit(params ): void {
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
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }


  openModalUpdate() {
    // @ts-ignore
    console.log('cellValue',this.cellValue);
    this.schoolSubjectComponent.openModalUpdateSubject(this.cellValue);
  }

  deleteSubject(){
    console.log('cellValue',this.cellValue);
    this.subjectService.deleteSubject(this.cellValue)
      .subscribe(responseAPI => {
        console.log('aaa',responseAPI);
        if (responseAPI.status === 'OK') {
          this.schoolSubjectComponent.findSubject();
          this.toastr.success(responseAPI.message);
          this.modalRef.hide();
        } else {
          this.toastr.error(responseAPI.message);
        }
      });
  }
}
