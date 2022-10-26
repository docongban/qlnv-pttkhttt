import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TreeviewConfig, TreeviewItem, TreeviewModule} from "ngx-treeview";
import {FormBuilder} from "@angular/forms";
import {ContactGroupService} from "../../../../../core/service/service-model/contact-group.service";
import {ToastrService} from "ngx-toastr";
import {CreateGroupComponent} from "../contact-group/create-group/create-group.component";
import {MatDialog} from "@angular/material/dialog";
import {ListTeacherSendMailComponent} from "./list-teacher-send-mail/list-teacher-send-mail.component";
import {Router} from "@angular/router";

@Component({
  selector: 'kt-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss'],
})
export class SendMailComponent implements OnInit {
  mailFormGroup = this.fb.group({
    title: [null],
    content: [null],
    files: [[]],
    send_type: [null],
  });
  listTreeViewTeacherRaw: any = {};
  listGroupTeacherRaw: any = [];

  constructor(private router: Router, private fb: FormBuilder, private contactGroupService: ContactGroupService, private changeDetectorRef: ChangeDetectorRef, private toast: ToastrService, private matDialog: MatDialog) {
  }

  items1 = [];
  config1 = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 220,
    hasSelectByGroup: true,
    selectByGroupValue: false,
    checkboxEnabled: true
  }
  result1 = [];
  items2 = [];
  config2 = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 220,
    hasSelectByGroup: false,
    hasDivider: true,
    selectByGroupValue: true,
    checkboxEnabled: true
  }
  result2 = [];

  ngOnInit(): void {
    this.getListTeacherTreeView();
    this.getListGroupTeacher();
  }

  getListTeacherTreeView(): void {
    this.contactGroupService.getListTeacherTreeView().subscribe(res => {
      console.log(res);
      this.listTreeViewTeacherRaw = res.body.response;
      this.items1 = res.body.response?.departmentsList.map(item => new TreeviewItem(this.transformToTreeViewItems(item, true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  getListGroupTeacher(): void {
    this.contactGroupService.getListTreeView().subscribe(res => {
      this.listGroupTeacherRaw = res.body.response;
      this.items2 = res.body.response?.map(item => new TreeviewItem(this.transformListGroupToTreeViewItems(item, true)));
      this.changeDetectorRef.detectChanges();
    })
  }

  transformListGroupToTreeViewItems(data: any, isRoot: boolean): any {
    const children = data.groupTeacherDetailsDTOList?.map(child => this.transformListGroupToTreeViewItems(child, false));
    const text = data.name ?? data.fullName ?? '';
    const groupName = data.parentGroupCode ? this.listGroupTeacherRaw.find(tree => tree.code === data.parentGroupCode)?.name : this.listGroupTeacherRaw.find(tree => tree.code === data.code)?.name;
    const value = {
      groupName: groupName ?? '',
      isRoot,
      isTeacher: data.fullName && data.teacherCode,
      totalTeachersOfUnit: isRoot ? data.totalTeacherDetails : null,
      text
    };
    return {...data, text, value, checked: false, children};
  }

  transformToTreeViewItems(data: any, isRoot: boolean, parent?: any): any {
    const children = (data.children ?? data.teacherDTOList)?.map(child => this.transformToTreeViewItems(child, false, data));
    const text = data.title ?? data.fullName ?? '';
    const groupName = data.code ? this.listTreeViewTeacherRaw.departmentsList.find(tree => tree.key === data.deptId)?.title : this.listTreeViewTeacherRaw.departmentsList.find(tree => tree.type === data.type)?.title;
    const value = {
      groupName: groupName ?? '',
      isRoot,
      isTeacher: data.fullName && data.code,
      totalTeachersOfUnit: isRoot ? data.totalTeachersOfUnit : null,
      text
    };
    return {...data, text, value, children};
  }

  onFileChange($event: any) {
    this.mailFormGroup.get('files').patchValue($event.target.files);
  }

  removeFile(i: number) {
    const files = Array.from(this.mailFormGroup.value.files);
    files.splice(i, 1);
    this.mailFormGroup.get('files').patchValue(files);
  }

  sendMail() {
    console.log(this.mailFormGroup.value, this.sendType(), this.listRecipientTeacherCode());
    const formData = new FormData();
    const sendMessageDTO = {
      title: this.mailFormGroup.value.title,
      content: this.mailFormGroup.value.content,
      sendType: this.sendType(),
      teacherCodeList: this.listRecipientTeacherCode()
    };
    if (this.mailFormGroup.value.files) {
      Array.from(this.mailFormGroup.value.files).forEach((file: any) => {
        formData.append('file', file);
      })
    }

    formData.append('sendMessageDTO', new Blob([JSON.stringify(sendMessageDTO)], {type: 'application/json'}))
    this.contactGroupService.sendMail(formData).subscribe(res => {
      if (res.status === 'OK') {
        this.toast.success(res.message);
        this.mailFormGroup.reset();
      } else this.toast.error(res.message);
    }, err => {
      this.toast.error(err.message);
    })
  }

  treeviewValueChange(e: any) {
    console.log(e);
    this.result1 = e;
    this.changeDetectorRef.detectChanges();
  }

  groupTeacherValueChange(e: any) {
    console.log(e);
    this.result2 = e;
    this.config1.checkboxEnabled = this.result2.length === 0;
    this.changeDetectorRef.detectChanges();
  }

  sendType(): any {
    if (this.result2.length > 0) return '2';
    else {
      if (this.config1.selectByGroupValue) return '1';
      else {
        if (this.items1.every(item => item.internalChecked)) return '0';
        else return '3';
      }
    }
  }

  listRecipientTeacher(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.isTeacher).map(r => r.isTeacher + '-' + r.text);
    else return this.result1.filter(r => r.isTeacher).map(r => r.isTeacher + '-' + r.text);
  }

  listRecipientGroup(): any {
    if (this.result2.length > 0) return [...new Set(this.result2.map(r => r.groupName))];
    else return [...new Set(this.result1.map(r => r.groupName))];
  }


  shouldShowBtn(listTeacher: any) {
    return listTeacher.offsetWidth < listTeacher.scrollWidth;
  }

  listRecipientTeacherCode(): any {
    if (this.result2.length > 0) return this.result2.filter(r => r.isTeacher).map(r => r.isTeacher);
    else return this.result1.filter(r => r.isTeacher).map(r => r.isTeacher);
  }

  openDialog(): void {
    this.matDialog.open(ListTeacherSendMailComponent, {
      data: this.result2.length > 0 ? this.result2.filter(r => r.isTeacher) : this.result1.filter(r => r.isTeacher),
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
    }).afterClosed().subscribe(res => {
      res.forEach(item => {
        const data = this.findItemNested(this.items1, item);
        data.checked = false;
        const index = this.result1.findIndex(r => r.isTeacher === data.value.isTeacher);
        this.result1.splice(index, 1);
      })
      this.changeDetectorRef.detectChanges();
    });
  }

  findItemNested(arr, itemId): any {
    if(!arr?.length) return;
    return arr.find(elm => {
      return elm.value.isTeacher === itemId
    }) ?? this.findItemNested(arr.flatMap(elm => elm.children || []), itemId);
  }

  navigateTo() {
    this.router.navigate(['system/contact/contact-group'], { state: { openCreateDialog: true } });
  }
}
