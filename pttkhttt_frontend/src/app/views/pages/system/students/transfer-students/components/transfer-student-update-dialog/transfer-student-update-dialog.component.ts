import {Component} from '@angular/core';
import {TransferStudent} from '../../shared/models/transfer-student';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {GradeLevelModel} from '../../../../../../../core/service/model/grade-level.model';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';
import {TransferStudentsService} from '../../shared/services/transfer-students.service';
import {ToastrService} from 'ngx-toastr';
import {getField} from '../../../../../../../helpers/utils';

@Component({
  selector: 'kt-transfer-student-update-dialog',
  templateUrl: './transfer-student-update-dialog.component.html',
  styleUrls: ['./transfer-student-update-dialog.component.scss']
})
export class TransferStudentUpdateDialogComponent {

  transferStudent: TransferStudent;
  afterUpdate: () => void;
  form: FormGroup;

  private readonly gradeSelectedSubject = new BehaviorSubject<GradeLevelModel>(undefined);
  private readonly gradeSelectedAction$ = this.gradeSelectedSubject.asObservable();

  schoolYearPairs$ = this.transferStudentsService.schoolYearPairs$
    .pipe(
      tap(schoolYearPairs => {
        this.form.patchValue({
          currentSchoolYear: schoolYearPairs.current,
          nextSchoolYear: schoolYearPairs.next
        });
      })
    );

  transferStatusItems$ = this.transferStudentsService.transferStatusItems$;

  grades$ = this.transferStudentsService.grades$
    .pipe(
      tap((grades: GradeLevelModel[]) => {
        const value = grades[0];
        this.gradeSelectedSubject.next(value);
        this.form.patchValue({gradeLevel: value})
      }),
      startWith([]),
      catchError(() => {
        return of([]);
      })
    );

  classes$: Observable<[]> = this.transferStudentsService.getClassesFromCombineLatestWithAnAction(this.gradeSelectedAction$)
    .pipe(
      tap((classes) => {
        this.form.patchValue({classCode: classes[0]})
      })
    );

  vm$ = combineLatest([
    this.schoolYearPairs$,
    this.transferStatusItems$,
    this.grades$,
    this.classes$
  ]).pipe(
    map(([schoolYearPairs, transferStatusItems, grades, classes]) => {
      return {
        schoolYearPairs,
        transferStatusItems,
        grades,
        classes
      }
    }),
  );

  get gradeLevel() {
    return this.form.get('gradeLevel');
  }

  get classCode() {
    return this.form.get('classCode');
  }

  get status() {
    return this.form.get('status');
  }

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef,
              private translateService: TranslateService,
              private transferStudentsService: TransferStudentsService,
              private toastr: ToastrService) {
  }

  isStatusEqual(a, b) {
    return a.id === b.id;
  }

  isGradeEqual(a, b) {
    return a.id === b.id;
  }

  isClassEqual(a, b) {
    return a.code === b.code;
  }

  onCancel() {
    this.bsModalRef.hide();
  }

  onGradeChanged(grade) {
    this.gradeSelectedSubject.next(grade);
  }

  onOk() {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value;

    const payload = {
      currentSchoolYear: value.currentSchoolYear,
      nextSchoolYear: value.nextSchoolYear,
      classCode: getField(value.classCode, 'code'),
      status: getField(value.status, 'id'),
    }

    const transferStudents = [{
      ...this.transferStudent,
      details: {
        ...this.transferStudent.details,
        currentSchoolYear: this.transferStudent.schoolYear,
        currentClassCode: this.transferStudent.classCode,
        academicAbility: this.transferStudent.assessDetails.academicAbility,
        conduct: this.transferStudent.assessDetails.conduct,
        status: payload.status,
        newClassCode: payload.classCode,
        newSchoolYear: payload.nextSchoolYear
      }
    }];

    this.transferStudentsService.transferStudent(transferStudents).subscribe(() => {
      this.toastr.success(this.translateService.instant('TRANSFER_STUDENTS.TRANSFER_SUCCESS'));
      this.bsModalRef.hide();
      this.afterUpdate();
    }, error => {
      console.log(error);
    })
  }
}
