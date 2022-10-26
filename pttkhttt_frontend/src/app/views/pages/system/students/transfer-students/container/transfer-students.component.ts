import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GradeLevelModel} from '../../../../../../core/service/model/grade-level.model';
import {TransferStudentsService} from '../shared/services/transfer-students.service';
import {map, tap} from 'rxjs/operators';
import {TransferStudentPayload} from '../shared/models/transfer-student-payload';
import {TransferStudent} from '../shared/models/transfer-student';
import {BehaviorSubject} from 'rxjs';
import {TransferStudentDialogComponent} from '../components/transfer-student-dialog/transfer-student-dialog.component';
import {TransferStudentUpdateDialogComponent} from '../components/transfer-student-update-dialog/transfer-student-update-dialog.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {download, exportName} from '../../../../../../helpers/utils';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'kt-transfer-students',
  templateUrl: './transfer-students.component.html',
  styleUrls: ['./transfer-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferStudentsComponent {

  private readonly selectedStudentsSubject = new BehaviorSubject<TransferStudent[]>([]);
  private readonly exportButtonSubject = new BehaviorSubject<boolean>(false);
  isShowTransferButton$ = this.selectedStudentsSubject.asObservable().pipe(map(v => v.length > 0));
  isShowExportButton$ = this.exportButtonSubject.asObservable();

  currentSchoolYear$ = this.transferStudentsService.currentSchoolYear$;

  schoolYearPair$ = this.transferStudentsService.schoolYearPairs$;

  gradeSelect$ = this.transferStudentsService.gradeSelect$;

  classSelect$ = this.transferStudentsService.classSelect$;

  transferStatusSelect$ = this.transferStudentsService.transferStatusSelect$;

  transferStudentPages$ = this.transferStudentsService.transferStudentPages$
    .pipe(
      tap(page => {
        this.exportButtonSubject.next(page.totalElements > 0)
      })
    );

  constructor(private transferStudentsService: TransferStudentsService,
              private modalService: BsModalService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private fb: FormBuilder) {
  }

  onGradeChange(selectedGrade: GradeLevelModel) {
    this.transferStudentsService.setSelectedGrade(selectedGrade);
  }

  onSearch(payload: TransferStudentPayload) {
    this.selectedStudentsSubject.next([]);
    this.transferStudentsService.searchTransferStudent(payload);
  }

  onPageChanged(page: number) {
    this.selectedStudentsSubject.next([]);
    this.transferStudentsService.setPageChanged(page);
  }

  onTransferStudentsSelected(transferStudents: TransferStudent[]) {
    this.selectedStudentsSubject.next(transferStudents);
  }

  onTransferClicked() {
    const selectedStudents = this.selectedStudentsSubject.value;

    if (this.invalid(selectedStudents)) {
      return;
    }

    this.modalService.show(TransferStudentDialogComponent, {
      initialState: {
        selectedStudents,
        form: this.fb.group({
          ...this.getControlsConfig(),
          status: [
            undefined,
            [Validators.required]
          ],
        }),
        afterTransfer: () => {
          this.transferStudentsService.setPageChanged(0);
        }
      },
      class: 'modal-dialog-centered'
    });
  }

  getControlsConfig() {
    return {
      currentSchoolYear: undefined,
      nextSchoolYear: undefined,
      gradeLevel: [
        undefined,
        [Validators.required]
      ],
      classCode: [
        undefined,
        [Validators.required]
      ]
    };
  }

  private invalid(selectedStudents: TransferStudent[]) {
    const errors = selectedStudents.filter(d => d.details.status !== null || d.assessDetails.id == null).reduce((acc, d) => {
      if (acc.status && acc.access) {
        acc.both = true;
      }

      if (!acc.status) {
        if (d.details.status !== null) {
          acc.status = true;
        }
      }

      if (!acc.access) {
        if (d.assessDetails.id === null) {
          acc.access = true;
        }
      }

      return acc;
    }, {
      both: false,
      access: false,
      status: false
    });

    const title = this.translateService.instant('TRANSFER_STUDENTS.INVALID_TRANSFER_TITLE');
    const options = {
      timeOut: 5000
    };

    if (errors.both) {
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.BOTH_NO_ACCESS_AND_ALREADY_TRANSFER_MSG'), title, options);
      return true;
    }

    if (errors.status) {
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.ALREADY_TRANSFER_MSG'), title, options);
      return true;
    }

    if (errors.access) {
      this.toastrService.error(this.translateService.instant('TRANSFER_STUDENTS.NO_ACCESS_MSG'), title, options);
      return true;
    }

    return false;
  }

  onEditClicked(transferStudent: TransferStudent) {
    this.modalService.show(TransferStudentUpdateDialogComponent, {
      initialState: {
        transferStudent,
        form: this.fb.group({
          ...this.getControlsConfig(),
          status: [
            {id: transferStudent.details.status},
            [Validators.required]
          ],
        }),
        afterUpdate: () => {
          this.transferStudentsService.setPageChanged(0);
        }
      },
      class: 'modal-dialog-centered'
    });
  }

  onExportClicked() {
    this.transferStudentsService.export()
      .subscribe(
        (bytes) => {
          if (bytes)
            download(bytes, exportName('DS_KetChuyen_'));
        },
        error => {
          console.log(error);
        }
      );
  }
}
