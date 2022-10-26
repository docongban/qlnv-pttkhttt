import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TeachingTimetableService} from '../shared/services/teaching-timetable.service';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, EMPTY} from 'rxjs';
import {TeachingSchedulePayload} from '../shared/models/teaching-schedule-payload';
import * as moment from 'moment';

@Component({
  selector: 'kt-teaching-timetable',
  templateUrl: './teaching-timetable.component.html',
  styleUrls: ['./teaching-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachingTimetableComponent {

  private readonly teachingScheduleFilteredSubject = new BehaviorSubject<TeachingSchedulePayload>(undefined);

  teacher$ = this.teachingTimetableService.getLoggedInTeacher();
  currentSchoolYear$ = this.teachingTimetableService.currentSchoolYear$.pipe(filter(d => Boolean(d)));
  semesterSelect$ = this.teachingTimetableService.semesterSelect$;
  vm$ = combineLatest([
    this.currentSchoolYear$,
    this.teacher$,
    this.semesterSelect$,
  ]).pipe(
    map(([currentSchoolYear, teacher, semesterSelect]) => ({
      teacher,
      data: {
        schoolYear: currentSchoolYear,
        teacherCode: teacher.code,
        semesterSelect,
        applyDate: moment().format('YYYY-MM-DD')
      }
    })),
  );

  teachingSchedule$ = this.teachingScheduleFilteredSubject
    .pipe(
      filter(payload => Boolean(payload)),
      mergeMap(payload => this.teachingTimetableService.searchTeachingSchedule(payload)),
      catchError(error => {
        return EMPTY;
      })
    );

  constructor(private teachingTimetableService: TeachingTimetableService) {
  }

  onFilter(payload: TeachingSchedulePayload) {
    this.teachingScheduleFilteredSubject.next(payload);
  }
}
