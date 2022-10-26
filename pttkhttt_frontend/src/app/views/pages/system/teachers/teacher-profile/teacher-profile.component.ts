import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {JobTransferHistoryOut, Teacher} from '../../../../../core/service/model/teacher.model'
import { TeacherService } from 'src/app/core/service/service-model/teacher.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import {environment} from './../../../../../../environments/environment';
import {ApParamService} from '../../../../../core/service/service-model/ap-param.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {ViewFileComponent} from './view-file/view-file.component';
import {STUDENTS, TEACHER} from '../../../../../helpers/constants';
import {DepartmentService} from '../../../../../core/service/service-model/unit.service';
import {SchoolServices} from '../../school/school.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {

  constructor(private teacherService: TeacherService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private dom: DomSanitizer,
              private matDialog: MatDialog,
              private departmentService: DepartmentService,
              private schoolServices: SchoolServices,
              private changeDetectorRef: ChangeDetectorRef
  ) {
    // Tab quá trình công tác
    this.columnDefsJobTransfer = [
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Thời gian',
        field: 'timeDisplay',
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        },
        tooltipField: 'timeDisplay',
        minWidth: 250,
        maxWidth: 250,
      },
      {
        headerName: 'Đơn vị công tác',
        field: 'dvct',
        height: 56,
        minWidth: 350,
        maxWidth: 350,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'dvct',
      },
      {
        headerName: 'Bộ phận công tác',
        field: 'departmentDisplay',
        height: 56,
        minWidth: 300,
        maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'departmentDisplay',
      },
      {
        headerName: 'Chức vụ đảm nhận', field: 'position',
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        minWidth: 350,
        maxWidth: 350,
        tooltipField: 'position',
      },
    ];

    // table khen thưởng
    this.columnDefsRewardBonus = [
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Ngày khen thưởng',
        cellRenderer: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Năm',
        field: 'rdYear',
        height: 56,
        minWidth: 150,
        maxWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Hình thức khen thưởng', field: 'rdType',
        height: 56,
        minWidth: 300,
        maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdType',
      },
      {
        headerName: 'Địa điểm khen thưởng', field: 'rdAddress',
        height: 56,
        minWidth: 300,
        maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdAddress',
      },
      {
        headerName: 'Nội dung khen thưởng', field: 'rdContent',
        minWidth: 300,
        maxWidth: 300,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdContent',
      }
    ];

    // Table ky luật
    this.columnDefsRewardPunish = [
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        }
      },
      {
        headerName: 'Ngày kỷ luật',
        cellRenderer: param => {
          return `${moment(param.data.rdDate).format('DD/MM/YYYY')}`
        },
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        }
      },
      {
        headerName: 'Năm',
        field: 'rdYear',
        height: 56,
        minWidth: 150,
        maxWidth: 150,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box'
        }
      },
      {
        headerName: 'Hình thức kỷ luật', field: 'rdType',
        height: 56,
        minWidth: 300,
        maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdType',
      },
      {
        headerName: 'Địa điểm kỷ luật', field: 'rdAddress',
        height: 56,
        minWidth: 300,
        maxWidth: 300,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdAddress',
      },
      {
        headerName: 'Nội dung kỷ luật', field: 'rdContent',
        minWidth: 300,
        maxWidth: 300,
        height: 56,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          display: 'webkit-box',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
        tooltipField: 'rdContent',
      }
    ];

    // Table lương
    // @ts-ignore
    this.columnDefsSalary = [
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Ngày hưởng',
        cellRenderer: param => {
          return `${moment(param.data.payDay).format('DD/MM/YYYY')}`
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Bậc lương',
        field: 'salaryLevelName',
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Ngạch/Hạng', field: 'rankName',
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Hệ số lương', field: 'coefficient',
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      }, {
        headerName: '% Vượt khung', field: 'exceedFrame',
        minWidth: 200,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '12px',
          display: 'webkit-box',
        }
      },
      {
        headerName: 'Ghi chú', field: 'description',
        minWidth: 250,
        maxWidth: 250,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#8F95B2',
          top: '12px',
          display: 'webkit-box',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'webkit-line-clamp': 1,
          'webkit-box-orient': 'vertical'
        },
      tooltipField: 'description',
      }
    ];

    this.columnDefsAllowances = [
      {
        headerName: 'STT',
        field: 'make',
        valueGetter: 'node.rowIndex + 1',
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
      {
        headerName: 'Thời gian',
        field: 'timeDisplay',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#3366FF',
          display: 'flex'
        }
      },
      {
        headerName: 'Bộ phận công tác',
        field: 'departmentDisplay',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
      {
        headerName: 'Chức vụ đảm nhận', field: 'position',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
      {
        headerName: 'Môn học giảng dạy', field: 'subjectName',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#696F8C',
          display: 'flex'
        }
      },
    ];

    this.columnAllowancesMode = [
      {
        headerName: 'THÔNG TIN PHỤ CẤP',
        field: 'allowanceMode',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex'
        }
      },
    ];
    this.teacher.createdName = JSON.parse(localStorage.getItem('currentUser')).fullName;
    this.route.params.subscribe(param => {
      this.teacher.id = param.id;
    });
  }
  @ViewChild('showPdf') public showPdf: ModalDirective;
  columnDefsJobTransfer;
  columnDefsSalary;
  columnAllowancesMode;
  columnDefsAllowances;
  columnDefsRewardBonus;
  columnDefsRewardPunish;
  rowData;
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 50;
  defaultColDef;
  selectDemo;
  university = {
    sysEdu: '',
    graduationYear: '',
    trainingPlaces: '',
    levelType: '',
    tranningCountry: '',
    degreePath: '',
    specialized: '',
    diplomaByte: '',
    name: '',
    fileName: '',
  };
  listMaster: any[];
  listDoctor: any[];
  certificatePath: any [];
  avatar;
  diploma;
  pdfFile = {
    name: '',
    byte: [],
    path: '',
  }

  certificates: any [];

  schoolName;
  schoolInfo: any;

  rowDataJobTransfer;

  teacher: Teacher = new Teacher();
  jobTransferHistoryOutList: any[];

  cellValue: string;

  modalRef: BsModalRef;
  dataPdfUrl;
  titleFile;
  listDepartment: [];
  color: any;
  listStatusTeacher = TEACHER.STATUS;
  trinhdo;
  fileNameMaster;
  fileNameDoctor;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  // gets called once before the renderer is used
  agInit(params): void {
    this.cellValue = params
  }

  ngOnInit() {
    this.schoolInfo = this.schoolServices.schoolInfo;
    this.schoolName = this.schoolInfo != null ? this.schoolInfo.name : `${environment.SCHOOL_NAME}`;
    this.teacherService.getInforById(this.teacher.id).then((res: any) => {
      this.rowDataJobTransfer = [];
      this.teacher = res;
      this.teacher.deptName = null;
      this.changeDetectorRef.detectChanges();
      // Color
      this.color = (res.status || res.status === 0) ? TEACHER.STATUS[res.status] : null;
      console.log(this.color);
      const positionArr = res.positionName.split(',').filter(word => word !== '');
      const positionStr = positionArr.length === 1 ? positionArr[0] : positionArr.concat([]);
      // Trình độ đào tạo
      if(this.teacher.specializeLevel === 1)
        this.trinhdo = 'ĐẠI HỌC';
      else if(this.teacher.specializeLevel === 2)
        this.trinhdo = 'THẠC SỸ';
      else
        this.trinhdo = 'TIẾN SỸ';
      // ===============================tab qua trinh cong tac==========================================
      this.teacher.jobTransferHistories.map(item => {
        item.dvct = this.schoolName;
        item.position = positionStr;
        item.timeDisplay = (item.endDate === null || item.endDate === undefined) ?
          (this.formatDate(item.fromDate) + ' - Nay') : (this.formatDate(item.fromDate) + ' - ' + this.formatDate(item.endDate));
        return item;
      });

      this.jobTransferHistoryOutList = res.jobTransferHistoryOutList;
      this.jobTransferHistoryOutList.map(item => {
        item.position = item.oldPosition;
        item.dvct = item.oldDept;
 		if (item.endDate === null && item.startDate !== null) {
          item.timeDisplay = this.formatDate(item.startDate) + ' - ...';
        }else if (item.endDate !== null && item.startDate !== null){
          item.timeDisplay = this.formatDate(item.startDate) + ' - ' + this.formatDate(item.endDate);
        }else if (item.endDate !== null && item.startDate == null){
          item.timeDisplay = '... - ' +this.formatDate(item.endDate);
        }        return item;
      });
      this.rowDataJobTransfer = [...this.teacher.jobTransferHistories, ...this.jobTransferHistoryOutList];
      console.log(this.teacher);
      // =====================================tab =======================================================
      this.teacher.startDate = this.teacher.startDate == null ? '' : moment(this.teacher.startDate).format('DD/MM/YYYY')
      this.teacher.birthDay = this.teacher.birthDay == null ? '' : moment(this.teacher.birthDay).format('DD/MM/YYYY')
      this.teacher.issuedDate = this.teacher.issuedDate == null ? '' : moment(this.teacher.issuedDate).format('DD/MM/YYYY')
      this.teacher.dateOfUnionMember = this.teacher.dateOfUnionMember == null ? '' : moment(this.teacher.dateOfUnionMember).format('DD/MM/YYYY')
      this.teacher.dateOfPartyMember = this.teacher.dateOfPartyMember == null ? '' : moment(this.teacher.dateOfPartyMember).format('DD/MM/YYYY')
      // Chức vụ
      const positionArr1 = res.positionName.split(',').filter(word => word !== '');
      this.teacher.positionName = positionArr1.length === 1 ? positionArr1[0] : positionArr1.concat([]);
      // Đơn vị, Tổ bộ môn
      this.teacherService.getDepartmentsById(this.teacher.deptId).subscribe(re=>{
        console.log(re)
        this.departmentService.apiGetDataTree(re.code, '', '', 0).then((resAPI: []) => {
          if (resAPI.length > 0) {
            this.listDepartment = resAPI;
            console.log(resAPI);
            // @ts-ignore
            this.teacher.unitName = this.listDepartment[0].name;
            // @ts-ignore
            if(this.listDepartment[0].children !== null){
              // @ts-ignore
              this.teacher.deptName = this.listDepartment[0].children[0].name;
            }
            // @ts-ignore
            if(this.listDepartment[0].children[0].children !== null)
              // @ts-ignore
              this.teacher.subjectParentName = this.listDepartment[0].children[0].children[0].name;
          }
        })
      })
      if (this.teacher.specializeLevels.length > 0) {
        // tslint:disable-next-line:triple-equals
        const obj = this.teacher.specializeLevelsDtos.filter(i => i.levelType == 1);
        this.listMaster = this.teacher.specializeLevelsDtos.filter(i => i.levelType === 2);
        this.listDoctor = this.teacher.specializeLevelsDtos.filter(i => i.levelType === 3);
        if (obj.length > 0) {
          this.university.sysEdu = obj[0].sysEdu === 1 ? 'Chính quy' : 'Tại chức';
          this.university.trainingPlaces = obj[0].trainingPlaces;
          this.university.tranningCountry = obj[0].tranningCountry;
          this.university.graduationYear = obj[0].graduationYear;
          this.university.specialized = obj[0].specialized;
          this.university.diplomaByte = obj[0].diplomaByte[0];
          this.university.degreePath = obj[0].degreePath;
          // this.university.name = 'Chứng chỉ 1';
          const nameFile = obj[0].degreePath.slice(obj[0].degreePath.lastIndexOf('saved') + 6, obj[0].degreePath.length);
          this.university.name = nameFile;
        }
      }

      if (this.teacher.avatar != null) {
        this.avatar = 'data:image/jpeg;base64,' + this.teacher.avatarByte;
      }
      // Chứng chỉ
      if (this.teacher.certificatePath != null) {
        const i = 1;
        this.certificates = [];
        let listData2 = [];
        this.teacher.certificatePathList.forEach(item => {
          let a = {};
          // this.pdfFile.name = 'Chứng chỉ ' + i++ + '.pdf';
          const pathFile:string = item;
          const nameFile = pathFile.slice(pathFile.lastIndexOf('saved') + 6, pathFile.length);
          console.log(nameFile);
          a = {...this.pdfFile, name: nameFile, path: item};
          // this.certificates.push(this.pdfFile);
          listData2 = [...listData2, a];
        })
        this.certificates = listData2;
        console.log(this.certificates);
      }
      // Tên file thạc sỹ
      if(this.listMaster.length > 0){
        // tslint:disable-next-line:max-line-length
        const nameFile = this.listMaster[0].degreePath.slice(this.listMaster[0].degreePath.lastIndexOf('saved') + 6, this.listMaster[0].degreePath.length);
        this.fileNameMaster = nameFile;
      }
      // Tên file tiến sỹ
      if(this.listDoctor.length > 0){
        // tslint:disable-next-line:max-line-length
        const nameFile = this.listDoctor[0].degreePath.slice(this.listDoctor[0].degreePath.lastIndexOf('saved') + 6, this.listDoctor[0].degreePath.length);
        this.fileNameDoctor = nameFile;
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  openModal(template: TemplateRef<any>) {
    // var file = new Blob([this.university.diplomaByte], {type: 'application/pdf'});
    // this.dataPdfUrl = this._base64ToArrayBuffer(this.university.diplomaByte);
    // this.dataPdfUrl = 'data:application/pdf;base64,' + this.university.diplom aByte;
    const file3 = new Blob([this.teacher.certificatePath], {type: 'application/pdf'});
    this.dataPdfUrl = this.dom.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file3));
    this.titleFile = this.university.name;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md modal-dialog-custom'})
    );
    console.log(this.dataPdfUrl)
  }

  _base64ToArrayBuffer(base64) {
    // tslint:disable-next-line:variable-name
    let binary_string = base64.replace(/\\n/g, '');
    binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate)
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
  }

  // View File
  viewFile(item: any){
    console.log(item);
    const data: any = {};
      this.teacherService.viewFile(item.path).subscribe(res=> {
        const file =(item.path.indexOf('.pdf') !== -1) ?
          new Blob([res], {type: 'application/pdf'}) :
          new Blob([res], {type: 'image/jpg'}) ;
        data.fileURL = URL.createObjectURL(file);
        data.check = 1;
        this.matDialog.open(ViewFileComponent, {
          width: '80vw',
          height: '90vh',
          hasBackdrop: true,
          data,
          disableClose: true,
        }).afterClosed().subscribe(dataRes => {
          console.log(dataRes);
        });
      });
    }
    viewFileDH(item: any){
    console.log(item);
    const data: any = {};
      this.teacherService.viewFile(item.degreePath).subscribe(res=> {
        const file =(item.degreePath.indexOf('.pdf') !== -1) ?
          new Blob([res], {type: 'application/pdf'}) :
          new Blob([res], {type: 'image/jpg'}) ;
        data.fileURL = URL.createObjectURL(file);
        data.check = 1;
        this.matDialog.open(ViewFileComponent, {
          width: '80vw',
          height: '80vh',
          hasBackdrop: true,
          data,
          disableClose: true,
        }).afterClosed().subscribe(dataRes => {
          console.log(dataRes);
        });
      });
    }
}
