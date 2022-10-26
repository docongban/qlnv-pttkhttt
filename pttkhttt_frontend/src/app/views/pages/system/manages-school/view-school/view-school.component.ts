import {Component, OnInit, TemplateRef} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {SchoolService} from '../../../../../core/service/service-model/school.service';
import {SchoolModel} from '../../../../../core/service/model/school.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'kt-view-school',
  templateUrl: './view-school.component.html',
  styleUrls: ['./view-school.component.scss']
})
export class ViewSchoolComponent implements OnInit , ICellRendererAngularComp{

  rowIndex;
  modalRef: BsModalRef;
  cellValue;
  school;
  lock = this.translate.instant('MANAGES_SCHOOL.STATUS_LOCK');
  activi = this.translate.instant('MANAGES_SCHOOL.STATUS_ACTIVE');
  inforSchool: SchoolModel = new SchoolModel();
  constructor(private modalService: BsModalService,
              private schoolService: SchoolService,
              private translate: TranslateService) { }

  ngOnInit(): void {
  }

  agInit(params ): void {
    this.rowIndex = +params.rowIndex + 1;
    this.cellValue = params;
    this.school = params.data;
  }

  refresh(params) {
    return true;
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'view-school-md' })
    );
    // Lấy thông tin của school
    this.schoolService.getInfor(this.school.id).subscribe(res=>{
      this.inforSchool = res;
    })
  }
}
