import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SelectableSettings} from '@progress/kendo-angular-grid';
import {SubjectService} from '../../../../core/service/service-model/subject.service';

@Component({
  selector: 'kt-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {


  gridData: any[] = ELEMENT_DATA;
  gridView: any[];

  listTypeOfSubject: Array<string> = ['Tự chọn', 'Bắt buộc'];
  listSubjectType: Array<string> = ['Tính điểm', 'Nhận xét'];

  chooseSubject: number;
  totalSubject: number;

  selectTableSetting: SelectableSettings = {
    checkboxOnly: true
  }
  public mySelection: string[] = [];

  pageSizes: Array<number> = [10,20];
  _pageSize: number = 5;

  constructor(private subjectService: SubjectService) {
    this.gridView = this.gridData;
  }

  ngOnInit() {
    // this.subjectService.getAllSubject().subscribe(data => {
    //   console.log(data);
    // });
    this.totalSubject = this.gridData.length;
    this.chooseSubject = 0;
    this.gridData.forEach((element: Subject) => {
      if (element.choose) {
        this.chooseSubject ++ ;
      }
    } )
  }

  changeChooseSubject(value) {
    if (value) {
      this.chooseSubject ++;
    } else this.chooseSubject --;
  }


  submitSearch(value:any) {
    console.log(value);
  }
}
export interface Subject {
  id: number;
  subject: string;
  acronym: string;
  typeOfSubject: string;
  subjectType: string;
  lessonsOfHK1: number;
  lessonsOfHK2: number;
  choose: boolean;
}
const ELEMENT_DATA: Subject[] = [
  {id: 1, subject: 'Toán', acronym: 'TO', typeOfSubject: 'Tự chọn',subjectType: 'Tính điểm', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true},
  {id: 2, subject: 'Tiếng Việt', acronym: 'TV', typeOfSubject: 'Bắt buộc',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true},
  {id: 3, subject: 'Đạo đức', acronym: 'ĐĐ', typeOfSubject: 'Tự chọn',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: false},
  {id: 4, subject: 'Tự nhiên', acronym: 'TNXH', typeOfSubject: 'Tự chọn',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: false},
  {id: 5, subject: 'Lịch sử và Địa lý', acronym: 'LSĐL', typeOfSubject: 'Bắt buộc',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true},
  {id: 6, subject: 'Âm nhạc', acronym: 'AN', typeOfSubject: 'Bắt buộc',subjectType: 'Tính điểm', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true},
  {id: 7, subject: 'Mỹ thuật', acronym: 'MT', typeOfSubject: 'Tự chọn',subjectType: 'Tính điểm', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true},
  {id: 8, subject: 'Thủ công', acronym: 'TC', typeOfSubject: 'Tự chọn',subjectType: 'Tính điểm', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: false},
  {id: 9, subject: 'Kỹ thuật', acronym: 'KT', typeOfSubject: 'Bắt buộc',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: false},
  {id: 10, subject: 'Thể dục', acronym: 'TD', typeOfSubject: 'Bắt buộc',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: false},
  {id: 11, subject: 'Ngoại ngữ', acronym: 'NN', typeOfSubject: 'Tự chọn',subjectType: 'Nhận xét', lessonsOfHK1: 3,lessonsOfHK2: 3, choose: true}
];
