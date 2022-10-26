import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {DeleteClassRoomComponent} from '../../../class-room/delete-class-room/delete-class-room.component';
import {MatDialog} from '@angular/material/dialog';
import {ContactGroupService} from '../../../../../../core/service/service-model/contact-group.service';
import {ToastrService} from 'ngx-toastr';
import {CreateGroupComponent} from '../create-group/create-group.component';
import {TreeviewItem} from 'ngx-treeview';

@Component({
  selector: 'kt-group-action',
  templateUrl: './group-action.component.html',
  styleUrls: ['./group-action.component.scss']
})
export class GroupActionComponent implements OnInit, ICellRendererAngularComp {

  rowSelect: any = {};
  rowIndex;
  items: any = []
  listTreeViewTeacherRaw = [];
  constructor(
    private matDialog: MatDialog,
    private contactGroupService: ContactGroupService,
    private toast: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getListTeacherTreeView();
  }

  // gets called once before the renderer is used
  agInit(params ): void {
    this.rowSelect = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }

  // Delete classroom
  openConfirmDelete() {
    const dataConfirm = {title: 'XÓA NHÓM LIÊN LẠC', message: 'Bạn có chắc chắn muốn xoá nhóm liên lạc đã chọn?'};
    this.matDialog.open(DeleteClassRoomComponent, {
      data: dataConfirm,
      disableClose: true,
      hasBackdrop: true,
      width: '420px'
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        // Call API
        const listGroupDelete = [];
        listGroupDelete.push(this.rowSelect);
        this.contactGroupService.deleteContactGroup({listGroupDelete}).subscribe(resAPI => {
          console.log(resAPI);
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
            this.contactGroupService.changeIsDelete(true);
          }else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
        });
      }
    });
  }

  updateContactGroup(action: string) {
    this.rowSelect.action = action;
    this.rowSelect.items = this.items;
    this.matDialog.open(CreateGroupComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: this.rowSelect
    }).afterClosed().subscribe(res => {
      if (res.event === 'confirm') {
        // Call API
        const listGroupDelete = [];
        listGroupDelete.push(this.rowSelect);
        this.contactGroupService.deleteContactGroup({listGroupDelete}).subscribe(resAPI => {
          console.log(resAPI);
          if (resAPI.status === 'OK') {
            this.toast.success(resAPI.message);
            this.contactGroupService.changeIsDelete(true);
          }else if (resAPI.status === 'BAD_REQUEST') {
            this.toast.error(resAPI.message);
          }
        });
      }
    });
  }

  getListTeacherTreeView(): void {
    this.contactGroupService.getListTeacherTreeView().subscribe(res => {
      console.log(res);
      this.listTreeViewTeacherRaw = res.body.response;
      this.items = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item,  true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformToTreeViewItems(data: any,  isRoot: boolean): any {
    const children = (data.children ?? data.teacherDTOList)?.map(child => this.transformToTreeViewItems(child, false));
    const text = data.title ?? data.fullName ?? '';
    const value = {
      code: data.type ?? data.code ?? '',
      id: data.id,
      deptId: data.deptId,
      deptCode: data.deptCode,
      deptName: data.deptName,
      isRoot,
      isTeacher: data.fullName && data.code,
      totalTeachersOfUnit: isRoot ? data.totalTeachersOfUnit : null,
      text
    };
    return {...data, text , value, children};
  }
}
