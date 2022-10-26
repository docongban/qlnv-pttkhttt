import {Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {RewardDisciplineModel} from '../../../../../core/service/model/reward-discipline.model';
import {RewardDisciplineService} from '../../../../../core/service/service-model/reward-discipline.service';
import {LeaveJobModel} from '../../../../../core/service/model/leave-job.model';
import {LeaveJobService} from '../../../../../core/service/service-model/leave-job.service';
import {JobTransferHistoryModel} from '../../../../../core/service/model/job-transfer-history.model';
import {SalaryAllowancesModel} from '../../../../../core/service/model/salary-allowances.model';
import {JobTransferHistoryService} from '../../../../../core/service/service-model/job-transfer-history.service';
import {ApParamService} from '../../../../../core/service/service-model/ap-param.service';
import {ToastrService} from 'ngx-toastr';
import {SalaryAllowancesService} from '../../../../../core/service/service-model/salary-allowances.service';
import {ClassroomService} from '../../../../../core/service/service-model/classroom.service';
import {FormBuilder} from '@angular/forms';
import {TeacherService} from '../../../../../core/service/service-model/teacher.service';
import {Teacher} from '../../../../../core/service/model/teacher.model';
import { Router } from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {DepartmentService} from '../../../../../core/service/service-model/unit.service';
import {DatePipe, formatDate} from '@angular/common';

@Component({
  selector: 'kt-action-teacher',
  templateUrl: './action-teacher.component.html',
  styleUrls: ['./action-teacher.component.scss']
})
export class ActionTeacherComponent implements OnInit, ICellRendererAngularComp {
  constructor(private modalService: BsModalService,
              private rewardDisciplineService: RewardDisciplineService,
              private leaveJobService: LeaveJobService,
              private jobTransferHistoryService: JobTransferHistoryService,
              private salaryAllowancesService: SalaryAllowancesService,
              private apParamService: ApParamService,
              private classromService: ClassroomService,
              private toastr: ToastrService,
              private fb:FormBuilder,
              private router:Router,
              private teacherService: TeacherService,
              private changeDetectorRef: ChangeDetectorRef,
              private departmentService: DepartmentService,
              private datePipe: DatePipe) {
  }
  unsubscribe$ = new Subject<void>();
  modalRef: BsModalRef;
  // rewardDisciplineModel: RewardDisciplineModel = new RewardDisciplineModel();
  // leaveJob: LeaveJobModel = new LeaveJobModel();
  // jobTransferHistory: JobTransferHistoryModel = new JobTransferHistoryModel();
  // salaryAllowances: SalaryAllowancesModel = new SalaryAllowancesModel();
  rewardDisciplineModel: RewardDisciplineModel;
  leaveJob: LeaveJobModel;
  jobTransferHistory: JobTransferHistoryModel;
  salaryAllowances: SalaryAllowancesModel;
  cellValue: string;
  teacher: any;
  salaryLeavel: any;
  rankSalary: any;
  year;
  appParamValue;
  listDeptParent = [];
  deptParentId;
  listDept = [];
  oldTeacher: Teacher = new Teacher();
  chuyen;
  rowIndex;
  currentRoles = [];
  isRole: boolean;
  // Role Admin, HT
  ADMIN = `${environment.ROLE.ADMIN}`;
  HT = `${environment.ROLE.HT}`;
  // Lỗi khen thưởng
  errorKhenThuong = {
    ht:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    diachi:{
      error: false,
      message: ''
    },
    noidung:{
      error: false,
      message: ''
    }
  }
  // Lỗi kỷ luật
  errorKyLuat = {
    ht:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    diachi:{
      error: false,
      message: ''
    },
    noidung:{
      error: false,
      message: ''
    }
  }
  // Lỗi phụ cấp
  errorPhuCap = {
    bl:{
      error: false,
      message: '',
    },
    hn:{
      error: false,
      message: ''
    },
    hs:{
      error: false,
      message: ''
    },
    vk:{
      error: false,
      message: ''
    },
    gc:{
      error: false,
      message: ''
    },
    tt:{
      error: false,
      message: ''
    }
  }
  // Lỗi don vi
  errorDV = {
    qd:{
      error: false,
      message: '',
    },
    date:{
      error: false,
      message: ''
    },
    dv:{
      error: false,
      message: ''
    },
    kh:{
      error: false,
      message: ''
    },
    ld:{
      error: false,
      message: ''
    },
    gc:{
      error: false,
      message: ''
    }
  }
  listDepartment: [];
  oldDeptId: any;
  errorTN = false;
  messgeTN =  '';

  ngOnInit() {
    // this.getYear();
    this.changeDetectorRef.detectChanges();
    this.currentRoles = JSON.parse(localStorage.getItem('currentUser')).authorities;
    if (this.currentRoles && this.currentRoles.length > 0) {
      // TODO: this.isRole = true không cho chỉnh sửa
      this.currentRoles.forEach(e=>{
        if(e === this.ADMIN || e === this.HT){
          this.isRole = false;
          return;
        }
      })
    }
  }



  // gets called once before the renderer is used
  agInit(params ): void {
    this.cellValue = params;
    this.teacher = params.data;
    this.rowIndex = +params.rowIndex + 1;
    console.log(this.teacher);
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    return true
  }


  openModal(template: TemplateRef<any>, act: number) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'addnew-unit-md modal-dialog-custom' })
    );
    // console.log(template.elementRef.references);
    // console.log(template.elementRef.nativeElement.querySelector('.'))
    console.log(act);
    this.rewardDisciplineModel = new RewardDisciplineModel();
    this.leaveJob = new LeaveJobModel();
    this.jobTransferHistory = new JobTransferHistoryModel();
    this.salaryAllowances = new SalaryAllowancesModel();
    this.leaveJob.breakTime = '1';
    this.chuyen = 0;
    this.errorDate = false;
    this.loadRankSalary();
    this.loadSalaryLevel();
    this.getListDV()
    this.getYear();
    this.changeDetectorRef.detectChanges();
    console.log(this.teacher);
    // Lấy giá trị cũ trước đó
    this.getSalaryAllowancen(this.teacher.code);
    if(act === 3){
      this.getLeaveJob(this.teacher.id, 1);
    }
    if(act === 4){
      this.getLeaveJob(this.teacher.id, 0);
    }
    if(act === 5){
      this.getLeaveJob(this.teacher.id, 2);
    }
    // Đon vị. Khoa, Bộ môn
    this.teacherService.getDepartmentsById(this.teacher.deptId).subscribe(re=>{
      console.log(re)
      this.departmentService.apiGetDataTree(re.code, '', '', 0).then((resAPI: []) => {
        if (resAPI.length > 0) {
          this.listDepartment = resAPI;
          console.log(resAPI);
          // @ts-ignore
          this.teacher.unitName = this.listDepartment[0].name;
          // @ts-ignore
          this.jobTransferHistory.oldDepartmentId = this.listDepartment[0].id;
          // @ts-ignore
          this.jobTransferHistory.newDepartmentId = this.listDepartment[0].id;
          this.teacherService.getDeptByParent(this.jobTransferHistory.newDepartmentId).then((res: []) => {
            if(res.length > 0){
              this.listDept = res;
              this.jobTransferHistory.newDeptId = this.listDept[0].id;
              let list = [];
              res.forEach(item=>{
                let customItem = {};
                // @ts-ignore
                customItem = {...item, name: item.code + ' - ' + item.name};
                list = [...list, customItem];
              })
              this.listDept = list;
            }
          })
          // this.changedeptParent();
          // @ts-ignore
          if(this.listDepartment[0].children !== null){
            // @ts-ignore
            this.teacher.deptName = this.listDepartment[0].children[0].name;
            // @ts-ignore
            this.jobTransferHistory.oldDeptId = this.listDepartment[0].id;
          }
        }
      })
    })
  }

  getSalaryAllowancen(teacherCode: any){
    this.salaryAllowancesService.getByTeacherCode(teacherCode).subscribe(res=>{
      if(res != null){
        this.salaryAllowances = res;
        this.salaryAllowances.id = null;
        this.salaryAllowances.datePay = this.datePipe.transform(new Date(res.payDay), 'yyyy-MM-dd');
      }
    })
  }

  getLeaveJob(teacherId: any, isLeave: any){
    this.leaveJobService.getByTeacherId(teacherId, isLeave).subscribe(res=>{
      if(res!= null){
        this.leaveJob = res;
        console.log(res);
        console.log(this.leaveJob);
        this.leaveJob.id = null;
        this.leaveJob.dateLeave = this.datePipe.transform(new Date(res.leaveDate), 'yyyy-MM-dd');
      }
    })
  }

 getYear(){
   this.classromService.yearCurrent$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
     this.rewardDisciplineModel.rdYear = res;
     console.log(res);
   })
   this.changeDetectorRef.detectChanges();
  }

  // Load bậc lương
  loadSalaryLevel(){
    const parentCode = 'salary_level';
    this.apParamService.getByParenCode(parentCode).subscribe(res=>{
      this.salaryLeavel = res.data;
    })
  }

  // Load ngach
  loadRankSalary(){
    const parentCode = 'rank_salary';
    this.apParamService.getByParenCode(parentCode).subscribe(res=>{
      this.rankSalary = res.data;
      console.log(this.rankSalary);
    })
  }

  // Load hệ số lương
  changeRankSalary(){
    this.apParamService.getById(this.salaryAllowances.rankId).subscribe(res=>{
      this.salaryAllowances.coefficient = res.value;
      console.log(res);
    })
  }
  // Load đơn vị
  getListDV(){
    this.teacherService.getParentDeptNull().then((res: []) => {
      if(res.length > 0){
        this.listDeptParent = res;
        this.jobTransferHistory.newDepartmentId = this.listDeptParent[0].id;
        let list = [];
        res.forEach(item=>{
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        })
        this.listDeptParent = list;
        this.changedeptParent();
      }
    })
  }
  // Khoa ban
  changedeptParent(){
    this.teacherService.getDeptByParent(this.jobTransferHistory.newDepartmentId).then((res: []) => {
      if(res.length > 0){
        this.listDept = res;
        this.jobTransferHistory.newDeptId = this.listDept[0].id;
        let list = [];
        res.forEach(item=>{
          let customItem = {};
          // @ts-ignore
          customItem = {...item, name: item.code + ' - ' + item.name};
          list = [...list, customItem];
        })
        this.listDept = list;
      }
    })
  }
  // check value
  changeValue(){
    if(this.chuyen === 0){
      // @ts-ignore
      this.jobTransferHistory.newDepartmentId = this.listDepartment[0].id;
      this.changedeptParent();
    }else{
      this.getListDV();
      // this.changedeptParent();
    }
  }
  // Khen thưởng
  bouns(){
    this.validateKhenThuong();
    this.rewardDisciplineModel.isReward = 1;
    this.rewardDisciplineModel.teacherId = this.teacher.id;
    this.rewardDisciplineService.addBouns(this.rewardDisciplineModel).subscribe(res=>{
      this.toastr.success('Thành công');
      this.rewardDisciplineModel = null;
      this.modalRef.hide();
    }, error => {
      this.toastr.error('Cập nhật khen thưởng không thành công!');
    })
  }

  discipline(){
    this.validateKyLuat();
    this.rewardDisciplineModel.isReward = 0;
    this.rewardDisciplineModel.teacherId = this.teacher.id;
    this.rewardDisciplineService.addBouns(this.rewardDisciplineModel).subscribe(res=>{
      this.toastr.success('Cập nhật kỷ luật thành công');
      this.modalRef.hide();
    }, error => {
      this.toastr.error('Cập nhật kỷ luật không thành công!');
    })
  }

  // Nghỉ việc
  quiJob(type: number){
    let messges;
    if(this.errorDate === true){
      return;
    }
    if(type === 1){
      this.leaveJob.isLeave = 1;
      this.leaveJob.breakTime = null;
    }
    if(type === 0){
      this.leaveJob.isLeave = 0
      this.leaveJob.breakTime = null;
    }
    if(type === 2){
      this.leaveJob.isLeave = 2;
    }
    if(this.errorTN === true){
      return ;
    }
    this.leaveJob.teacherId = this.teacher.id;
    this.leaveJobService.addLeaveJob(this.leaveJob).subscribe(res=>{
      if(type === 1)
        messges = 'Cập nhật nghỉ hưu thành công';
      if(type === 0)
        messges = 'Cập nhật nghỉ việc thành công';
      if(type === 2)
        messges = 'Cập nhật tạm nghỉ thành công'
      this.toastr.success(messges);
      this.leaveJobService.changeIsReload(true);
      this.modalRef.hide();
    }, error => {
      if(type === 1)
        messges = 'Cập nhật nghỉ hưu không thành công';
      if(type === 0)
        messges = 'Cập nhật nghỉ việc không thành công';
      if(type === 2)
        messges = 'Cập nhật tạm nghỉ không thành công'
      this.toastr.error(messges);
    })
  }

  // Chuyển đơn vị phòng ban
  changeDepartment(){
    this.validateDV();
    this.jobTransferHistory.teacherCode = this.teacher.code;
    this.jobTransferHistory.oldPosition = 'ROLE_BGH';
    this.jobTransferHistory.type = this.chuyen;
    // chuyển cùng đơn vị
    if(this.chuyen === 0){
      this.jobTransferHistoryService.addJobTransferHistory(this.jobTransferHistory).subscribe(res=>{
        this.toastr.success('Cập nhật chuyển đơn vị thành công!');
        this.leaveJobService.changeIsReload(true);
        this.modalRef.hide();
      }, error => {
        this.toastr.error('Cập nhật chuyển đơn vị không thành công!');
      })
    }
    // Chuyển khác đơn vị
    else{
      this.jobTransferHistoryService.addJobTransferHistory(this.jobTransferHistory).subscribe(res=>{
        this.toastr.success('Cập nhật chuyển đơn vị thành công!');
        this.leaveJobService.changeIsReload(true);
        this.modalRef.hide();
      }, error => {
        this.toastr.error('Cập nhật chuyển đơn vị không thành công!');
      })
    }
  }

  // Cập nhật lương phụ cấp
  updateSalary(){
    this.validatePhuCap();
    this.salaryAllowances.teacherCode = this.teacher.code;
    this.salaryAllowancesService.addSalaryAllowances(this.salaryAllowances).subscribe(res=>{
      this.toastr.success('Cập nhật lương phụ cấp thành công!');
      this.modalRef.hide();
    }, error => {
      this.toastr.error('Cập nhật lương phụ cấp không thành công!');
    })
  }

  // Validate
  // check Date
  isDate(s) {
    if(isNaN(s) && !isNaN(Date.parse(s)))
      return true;
    else return false;
  }
  openUpdate(){
    this.router.navigate(['/system/teacher/create-update-teacher'], { queryParams: {id: this.teacher.id}});
  }

  isEmpty(data: any): boolean {
    return data === null || data === undefined || data === ''
  }

  // cancel(){
  //   this.modalRef.hide();
  //   // rewardDisciplineModel
  //   this.rewardDisciplineModel.rdType = null;
  //   this.rewardDisciplineModel.rdDate = null;
  //   this.rewardDisciplineModel.rdAddress = null;
  //   this.rewardDisciplineModel.rdContent = null;
  //   // salaryAllowances
  //   this.salaryAllowances = null;
  //   // jobTransferHistory
  //   this.jobTransferHistory = null;
  //   this.leaveJob = null;
  // }

  // validate khen thưởng
  validateKhenThuong():void{
    this.validateHT();
    this.validateDate();
    this.validateDiaChi();
    this.validateND();
  }

  // hình thức khen thưởng
  validateHT(){
    if(this.isEmpty(this.rewardDisciplineModel.rdType)){
      this.errorKhenThuong.ht.error = true;
      this.errorKhenThuong.ht.message = 'Hình thức khen thưởng không được bỏ trống';
      return;
    }else if(this.rewardDisciplineModel.rdType.length > 250){
      this.errorKhenThuong.ht.error = true;
      this.errorKhenThuong.ht.message = 'Hình thức khen thưởng có độ dài tối đa là 250 ký tự';
      return;
    }
    this.errorKhenThuong.ht.error = false;
  }
  // ngày khen thưởng
  validateDate(){
    if(this.isEmpty(this.rewardDisciplineModel.dateRd)){
      this.errorKhenThuong.date.error = true;
      this.errorKhenThuong.date.message = 'Ngày khen thưởng không hợp lệ';
      return;
    }
    this.errorKhenThuong.date.error  = false;
  }

  // Đia chỉ
  validateDiaChi(){
    if(this.isEmpty(this.rewardDisciplineModel.rdAddress)){
      this.errorKhenThuong.diachi.error = true;
      this.errorKhenThuong.diachi.message = 'Địa điểm khen thưởng không được bỏ trống';
      return;
    }else if(this.rewardDisciplineModel.rdAddress.length > 250){
      this.errorKhenThuong.diachi.error = true;
      this.errorKhenThuong.diachi.message = 'Địa điểm khen thưởng có độ dài tối đa là 250 ký tự';
      return;
    }
    this.errorKhenThuong.diachi.error = false;
  }
  // Noi dung
  validateND(){
    if(!this.isEmpty(this.rewardDisciplineModel.rdContent) && this.rewardDisciplineModel.rdContent.length > 500){
      this.errorKhenThuong.noidung.error = true;
      this.errorKhenThuong.noidung.message = 'Ghi chú có độ dài tối đa là 500 ký tự';
      return;
    }
    this.errorKhenThuong.noidung.error = false;
  }

  // Validate kỷ luật
  validateKyLuat():void{
    this.validateKLHT();
    this.validateKLDate();
    this.validateKLDiaChi();
    this.validateKLND();
  }

  // hình thức kỷ luật
  validateKLHT(){
    if(this.isEmpty(this.rewardDisciplineModel.rdType)){
      this.errorKyLuat.ht.error = true;
      this.errorKyLuat.ht.message = 'Hình thức kỷ luật không được bỏ trống';
      return;
    }else if(this.rewardDisciplineModel.rdType.length > 250){
      this.errorKyLuat.ht.error = true;
      this.errorKyLuat.ht.message = 'Hình thức kỷ luật có độ dài tối đa là 250 ký tự';
      return;
    }
    this.errorKyLuat.ht.error = false;
  }
  // ngày kỷ luật
  validateKLDate(){
    if(this.isEmpty(this.rewardDisciplineModel.dateRd)){
      this.errorKyLuat.date.error = true;
      this.errorKyLuat.date.message = 'Ngày kỷ luật không hợp lệ';
      return;
    }
    this.errorKyLuat.date.error  = false;
  }

  // Đia chỉ
  validateKLDiaChi(){
    if(this.isEmpty(this.rewardDisciplineModel.rdAddress)){
      this.errorKyLuat.diachi.error = true;
      this.errorKyLuat.diachi.message = 'Địa điểm kỷ luật không được bỏ trống';
      return;
    }else if(this.rewardDisciplineModel.rdAddress.length > 250){
      this.errorKyLuat.diachi.error = true;
      this.errorKyLuat.diachi.message = 'Địa điểm kỷ luật có độ dài tối đa là 250 ký tự';
      return;
    }
    this.errorKyLuat.diachi.error = false;
  }
  // Noi dung
  validateKLND(){
    if(!this.isEmpty(this.rewardDisciplineModel.rdContent) &&  this.rewardDisciplineModel.rdContent.length > 500){
      this.errorKyLuat.noidung.error = true;
      this.errorKyLuat.noidung.message = 'Nội dung kỷ luật có độ dài tối đa là 500 ký tự';
      return;
    }
    this.errorKyLuat.noidung.error = false;
  }

  // Validate phụ cấp
  validatePhuCap():void{
    this.validateBL();
    this.validateHN();
    this.validateHS();
    this.validateGC();
    this.validateTT();
  }
  // Bac luong
  validateBL(){
    if(this.isEmpty(this.salaryAllowances.salaryLevelId)){
      this.errorPhuCap.bl.error = true;
      this.errorPhuCap.bl.message = 'Bậc lương không để trống';
      return;
    }
    this.errorPhuCap.bl.error = false;
  }
  // validate hạng ngạch
  validateHN(){
    if(this.isEmpty(this.salaryAllowances.rankId)){
      this.errorPhuCap.hn.error = true;
      this.errorPhuCap.hn.message = 'Hạng ngạch không được để trống';
      return;
    }
    this.errorPhuCap.hn.error = false;
  }
  // Hệ số lương
  validateHS(){
    if(this.isEmpty(this.salaryAllowances.coefficient)){
      this.errorPhuCap.hs.error = true;
      this.errorPhuCap.hs.message = 'Hệ số không được để trống';
      return;
    }
    this.errorPhuCap.hs.error = false;
  }

  // Ghi chú
  validateGC(){
    if(!this.isEmpty( this.salaryAllowances.description) && this.salaryAllowances.description.length > 500){
      this.errorPhuCap.gc.error = true;
      this.errorPhuCap.gc.message = 'Ghi chú có độ dài 500 ký tự';
      return;
    }
    this.errorPhuCap.gc.error = false;
  }

  // Thông tin phụ cấp
  validateTT(){
    if(!this.isEmpty(this.salaryAllowances.allowanceMode) && this.salaryAllowances.allowanceMode.length > 500){
      this.errorPhuCap.tt.error = true;
      this.errorPhuCap.tt.message = 'Thông tin phụ cấp có độ dài 500 ký tự';
      return;
    }
    this.errorPhuCap.tt.error = false;
  }

  // Validate chuyển đon vị
  validateDV(){
    this.validateDVQD();
    this.validateDVDate();
    this.validateDVC();
    this.validateDVKH();
    this.validateDVLD();
    this.validateDVGC();
  }
  // quyết định
  validateDVQD(){
    if(this.isEmpty(this.jobTransferHistory.code)){
      this.errorDV.qd.error = true;
      this.errorDV.qd.message = 'Quyết định chuyển không được bỏ trống';
      return;
    }else if(this.jobTransferHistory.code.length > 250){
      this.errorDV.qd.error = true;
      this.errorDV.qd.message = 'Quyết định chuyển có độ dài 250 ký tự';
      return;
    }
    this.errorDV.qd.error = false;
  }

  // Ngay chuyen
  validateDVDate(){
    if(this.isEmpty(this.jobTransferHistory.dateTransfer)){
      this.errorDV.date.error = true;
      this.errorDV.date.message = 'Ngày chuyển không hợp lệ';
      return;
    }
    this.errorDV.date.error = false;
  }
  // Đơn vị chuyển
  validateDVC(){
    if(this.isEmpty(this.jobTransferHistory.newDepartmentId)){
      this.errorDV.dv.error = true;
      this.errorDV.dv.message = 'Đơn vị chuyển không được bỏ trống';
      return;
    }
    this.errorDV.dv.error = false;
  }
  // Khoa bam
  validateDVKH(){
    if(this.isEmpty(this.jobTransferHistory.newDeptId)){
      this.errorDV.kh.error = true;
      this.errorDV.kh.message = 'Khoa/Ban không được bỏ trống';
      return;
    }
    this.errorDV.kh.error = false;
  }
  // Lý do
  validateDVLD(){
    if(this.isEmpty(this.jobTransferHistory.reason)){
      this.errorDV.ld.error = true;
      this.errorDV.ld.message = 'Lý do chuyển không được bỏ trống';
      return;
    }else if(this.jobTransferHistory.reason.length > 250){
      this.errorDV.ld.error = true;
      this.errorDV.ld.message = 'Lý do chuyển có độ dài 250 ký tự';
      return;
    }
    this.errorDV.ld.error = false;
  }
  // Ghi chú
  validateDVGC(){
    if(!this.isEmpty(this.jobTransferHistory.description) && this.jobTransferHistory.description.length > 500){
      this.errorDV.gc.error = true;
      this.errorDV.gc.message = 'Ghi chú có độ dài 500 ký tự';
      return;
    }
    this.errorDV.gc.error = false;
  }
  // Check ngày tạm nghỉ
  checkNgayTamNghi(){
    if(!this.isEmpty(this.leaveJob.breakTime)){
      const tn: number = + this.leaveJob.breakTime;
      if(tn < 1 || tn > 100){
        this.errorTN = true;
        this.messgeTN =  'Thời gian tạm nghỉ từ 1 - 100';
        return;
      }
      this.errorTN = false;
    }
  }

  errorDate: boolean = false;
  validateLeaveDate($event){
    console.log($event.target.value);
    // if(this.leaveJob.leaveDate != null){
      const today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      const dateValue = formatDate($event.target.value, 'yyyy/MM/dd', 'en');
      if(today > dateValue){
        this.errorDate = true;
        return;
      }
      this.errorDate = false;
    // }
    console.log(this.errorDate);
  }
}
