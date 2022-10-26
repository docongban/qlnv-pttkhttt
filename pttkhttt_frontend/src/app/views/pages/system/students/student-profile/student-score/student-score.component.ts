import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kt-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.scss']
})
export class StudentScoreComponent implements OnInit {

  @Input() studentCode: any;

  constructor() { }

  ngOnInit(): void {
  }

}
