import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { ToastrService } from "ngx-toastr";
import { Department } from 'src/app/core/service/model/department.model';
import { DepartmentService } from 'src/app/core/service/service-model/unit.service';
import * as _ from 'lodash';
import { SchoolServices } from '../school.service';

@Component({
  selector: 'kt-action-shool',
  templateUrl: './action-shool.component.html',
  styleUrls: ['./action-shool.component.scss']
})
export class ActionShoolComponent implements OnInit, ICellRendererAngularComp {
  nodes = [];
  modalRef: BsModalRef;
  rowIndex;
  constructor(private modalService: BsModalService, private deparmentService: DepartmentService, private toast: ToastrService, private schoolSv: SchoolServices) { }

  ngOnInit() {
  }

  blCode: boolean;
  blName: boolean;
  blType: boolean;
  department: Department = new Department();
  cellValue;
  item;
  typeUnit;
  listTeacher = []
  listUnitParent: any = []
  listPosition = [
    {
      id: 0,
      name: 'Hiệu trưởng'
    },
    {
      id: 1,
      name: 'Trưởng phòng'
    },
    {
      id: 2,
      name: 'Trưởng khoa/ban'
    },
    {
      id: 3,
      name: 'Trưởng tổ bộ môn'
    },
    {
      id: 4,
      name: 'Trưởng bộ môn'
    },
  ];
  // gets called once before the renderer is used
  agInit(params): void {
    this.item = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  // gets called whenever the cell refreshes
  refresh(params) {

    // set value into cell again
    return true
  }


  openModal(template: TemplateRef<any>) {

    this.department = undefined;
    this.department = this.item;
    this.blCode = false;
    this.blName = false;
    this.blType = false;
    this.getListUnitParent();

    if(this.department.parentId != null){
      this.getListTeacher(this.department.parentId);
    }
    this.getTypeUnit(this.department.parentId);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
  }

  getListUnitParent() {
    this.listUnitParent = [];
    this.deparmentService.apiGetAll().then((res: Department[]) => {
      this.removeExpand(res);
      this.nodes = res;
      this.listUnitParent = res;
    });
  }

  removeExpand(deptList: any) {
    if (deptList.constructor === Array) {
      deptList.map(e => {
        if(e.children === null) {
          e.isLeaf = true;
          return e;
        }else {
          this.removeExpand(e.children);
        }
      });
    }
  }

  customSearchtUnit(term: string, item: any) {
    if (item.code != null && item.name != null) {
      term = term.toLocaleLowerCase();
      return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1
    }
  }

  getTypeUnit(id){
    this.deparmentService.getTypeUnit(id).then((res: any) =>{
      this.typeUnit = res;
      if(id != '' && res.length == 1){
        this.department.type = res[0].code;
      }
    }, err => {
      console.log(err)
    })
  }

  getListTeacher(id) {
    this.deparmentService.getTeacherByDept(id).then((res: any) => {
      this.listTeacher = res;
    }, err => {
      console.log(err)
    })
  }

  changeUnit() {
    this.getTypeUnit(this.department.parentId);
    this.getListTeacher(this.department.parentId);
  }

  onChange($event: string): void {
    console.log($event);
    this.getTypeUnit($event);
    this.getListTeacher($event);
    this.validate();
  }


  DeleteUnit() {
    this.deparmentService.deleteSchool(this.department.id).subscribe(
      (res: any) => {
        if(res.status === 'BAD_REQUEST'){
          this.toast.error(res.message);
        }else{
          this.toast.success(res.message);
          this.modalRef.hide();
          this.schoolSv.loading.next('loading');
        }
      },
      (err) => {
        this.toast.error("Đã có lỗi xảy ra!");
        return;
      }
    )

  }
  loadding(){
    this.schoolSv.loading.next('loading');
  }

  validate() {
    this.blName = false;
    this.blType = false;
    let check = false;
    if(_.isNil(this.department.name)){
      this.blName = true;
      check = true;
    }else{
      if (_.isNil(this.department.name.trim()) || _.isEmpty(this.department.name.trim())) {
        this.blName = true;
        check = true;
      }
    }

    if ((!_.isNil(this.department.name) || !_.isEmpty(this.department.name)) && _.size(this.department.name) > 250) {
      check = true;
    }
    if (this.department.id === this.department.parentId) {
      check = true;
    }
    if (_.isNil(this.department.type) || _.isEmpty(this.department.type)) {
      this.blType = true;
      check = true;
    }
    if ((!_.isNil(this.department.description) || !_.isEmpty(this.department.description)) && _.size(this.department.description) > 550) {
      check = true;
    }
    console.log(check);
    return check;
  }

  update() {
    if (!this.validate()) {
      //hard code create_name
      this.department.createdName = 'test'
      this.department.updatedName = 'test'
      this.deparmentService.updateDepartment(this.department).subscribe(res => {
        if(res.status === 'BAD_REQUEST'){
          this.toast.error(res.message);
        }else{
          this.toast.success(res.message);
          this.modalRef.hide();
          this.schoolSv.loading.next('loading');
        }
      }, err => {
        console.log(err);
        this.toast.error('Update thất bại')
      })
    }
  }
}
