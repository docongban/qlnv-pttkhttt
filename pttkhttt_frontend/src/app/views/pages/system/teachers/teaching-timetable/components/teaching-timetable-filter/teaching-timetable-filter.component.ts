import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {TeachingSchedulePayload} from '../../shared/models/teaching-schedule-payload';
import * as moment from 'moment';

@Component({
  selector: 'kt-teaching-timetable-filter',
  templateUrl: './teaching-timetable-filter.component.html',
  styleUrls: ['./teaching-timetable-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachingTimetableFilterComponent {

  semesters;
  @Output() filter = new EventEmitter<TeachingSchedulePayload>();
  form = this.fb.group({
    schoolYear: undefined,
    teacherCode: undefined,
    semester: [
      undefined,
      [Validators.required]
    ],
    applyDate: [
      undefined,
      [Validators.required, this.validDate.bind(this)]
    ]
  });

  constructor(private fb: FormBuilder) {
  }

  @Input() set data({schoolYear, teacherCode, semesterSelect, applyDate}) {
    this.semesters = semesterSelect.items;

    this.form.patchValue({
      semester: semesterSelect.defaultValue,
      schoolYear,
      teacherCode,
      applyDate
    });

    this.emmitFilter();
  }

  get semester() {
    return this.form.get('semester');
  }

  get applyDate() {
    return this.form.get('applyDate');
  }

  isSemesterEqual(a, b) {
    return a.id === b.id;
  }

  validDate(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return null;
    }

    try {
      const semester = this.semester.value;
      if (!moment(value).isBetween(moment(semester?.fromDate), moment(semester?.toDate))) {
        return {
          invalidDate: true
        }
      }
    } catch (ignore) {
    }
    return null;
  }

  emmitFilter() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;

    this.filter.emit({
      ...this.form.value,
      semester: value.semester?.semester
    });
  }

  onSemesterChanged() {
    this.applyDate.updateValueAndValidity();
    this.emmitFilter();
  }

  onApplyDateChanged() {
    this.emmitFilter();
  }
}
