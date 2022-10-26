import {Component, Input} from '@angular/core';
import {TeachingSchedule} from '../../shared/models/teaching-schedule';
import {Period} from '../../shared/models/period';

@Component({
  selector: 'kt-teaching-schedule',
  templateUrl: './teaching-schedule.component.html',
  styleUrls: ['./teaching-schedule.component.scss']
})
export class TeachingScheduleComponent {
  MORNING = Period.MORNING;
  AFTERNOON = Period.AFTERNOON;
  @Input() teachingSchedule: TeachingSchedule;
}
