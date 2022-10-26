// Angular
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, Subject, timer} from 'rxjs';
import {finalize, scan, takeUntil, takeWhile, tap} from 'rxjs/operators';
// Translate
import {TranslateService} from '@ngx-translate/core';
// Store
import {Select, Store} from '@ngxs/store';
// Auth
import {AuthNoticeService, AuthService} from '../../../../core/auth';
import {TenantState} from '../../../../core/service/states/tenant.state';
import {GetAllTenant} from '../../../../core/service/actions/tenant.action';
import {NotiService} from '../../../../core/service/service-model/notification.service';
import {CommonResponseModel} from '../../../../core/service/model/common-response.model';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../../environments/environment';
import {SchoolServices} from '../../system/school/school.service';
import {StorageSessionService} from "../../../../core/auth/_services/storage.session.service";

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
  PHONE: '0123456789',
  PASSWORD: '123456aA@'
};

interface TenantItem {
  name: string;
  id: string;
}


@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  // countDown: Subscription;
  // counter: any = `${environment.timer}`;
  counter: any = 120;
  tick = 1000;
  threeLastNumber: any;
  otpInput: any;
  numberOtpInput: number = 0;
  loginForm: FormGroup;
  otpForm: FormGroup;
  verifyOTPForm: FormGroup;
  loading = false;
  loadingOtp = false;
  loadingVerifyOtp = false;
  otp: any;
  passwordReset: any;
  errors: any = [];
  accountName: string;
  timer$: any
  componentDestroyed$: Subject<boolean> = new Subject()
  roleParam: any;
  verifySuccess: boolean = false;
  private unsubscribe: Subject<any>;
  info: any
  private returnUrl: any;

  @Select(TenantState.getAllTenant) tenants: Observable<CommonResponseModel[]>
  source: Array<TenantItem>;
  data: Array<TenantItem>;
  toggle1: any = false;
  toggle2: any = false;
  modalRef: BsModalRef;
  @ViewChild('newUnit') public newUnit: ModalDirective;

  constructor(
    private router: Router,
    private auth: AuthService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notiService: NotiService,
    private modalService: BsModalService,
    private schoolServices: SchoolServices,
    private storageSessionService: StorageSessionService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    // // this.storageSessionService.setItem(this.storageSessionService.SCHOOL_INFO, JSON.stringify(this.schoolInfo));

    this.otp = '';
    this.passwordReset = '';
    this.accountName = '';
    this.store.dispatch(new GetAllTenant());
    this.tenants.subscribe((tenant) => {
      if (typeof tenant !== 'undefined') {
        this.source = tenant.map(value => {
          return {name: value.name, id: value.id}
        });
        this.data = this.source.slice();
      }
    })

    this.initLoginForm();
    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/system/dashboard';
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
    this.loadingOtp = false;
    this.loadingVerifyOtp = false;
    this.timer$ = null;
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initLoginForm() {
    // demo message to show
    if (!this.authNoticeService.onNoticeChanged$.getValue()) {
      const initialNotice = `Use account
			<strong>${DEMO_PARAMS.PHONE}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
      this.authNoticeService.setNotice(initialNotice, 'info');
    }

    this.loginForm = this.fb.group({
      phone: new FormControl('', [Validators.maxLength(50)]),
      password: new FormControl('', [Validators.maxLength(20)]),

    });

    this.otpForm = this.fb.group({
      accountName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    });

    this.verifyOTPForm = this.fb.group({
      otpNumber1: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      otpNumber2: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      otpNumber3: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      otpNumber4: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      otpNumber5: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
      otpNumber6: new FormControl('', [Validators.maxLength(1), Validators.pattern(/^-?([0-9]\d*)?$/)]),
    });

  }

  get f() {
    return this.loginForm;
  }

  get f1() {
    return this.otpForm;
  }

  get f2() {
    return this.verifyOTPForm;
  }

  onBlurEvent(event: any) {
    // this.loginForm.patchValue({
    //   phone: event.target.value.replace(/\s/g, ''),
    // });
    const data = event.target.value.replace(/\s/g, '')
    this.loginForm.patchValue({
      phone: data,
    });
    if (data === '') {
      return this.loginForm.controls['phone'].setErrors({isNullUser: true})
    }
    return null;

    // this.loginForm.controls.phone.value("111111111");
    // console.log(event.target.value);
  }

  /**
   * Form Submit
   */
  submit() {
    const controls = this.loginForm.controls;
    /** check form */
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    const authData = {
      phone: controls.phone.value,
      password: controls.password.value
    };

    this.auth.login(authData.phone.trim(), authData.password.trim())
      .pipe(
        tap(user => {
          if (user) {
            // this.router.navigate(['/system/school/configuration']);
            this.router.navigate([this.returnUrl])
            this.notiService.showNoti(this.translate.instant('AUTH.LOGIN.MESSAGE.SUCCESS'), 'success');
            this.loading = false;
          } else {
            this.notiService.showNoti(this.translate.instant('AUTH.LOGIN.MESSAGE.FAILURE'), 'warning');
            // this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
            this.loading = false;
          }
        }, error => {
          if (error.error.status === undefined || error.error.status === null) {
            this.notiService.showNoti(this.translate.instant('SYSTEM.CONNECT_FAILURE'), 'error');
          } else {
            this.notiService.showNoti(error.error.message, 'error');
          }

        }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();0
        })
      )
      .subscribe();
    this.cdr.detectChanges();
  }

  changeType(type, num) {
    if (type.type === 'password') {
      type.type = 'text';
    } else {
      type.type = 'password';
    }

    if (num === 1)
      this.toggle1 = !this.toggle1;
    else
      this.toggle2 = !this.toggle2;
  }

  isVietnamesePhoneNumber(phoneNumber) {
    return /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(phoneNumber);
  }

  openModal(template: TemplateRef<any>) {
    this.timer$ = null;
    this.verifyOTPForm.reset()
    this.otpForm.reset()
    this.resetValue()
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'addnew-unit-md modal-dialog-custom'})
    );
  }

  onBlurEventOTP(event: any) {
    this.otpForm.patchValue({
      accountName: event.target.value.replace(/\s/g, ''),
    });
    // this.loginForm.controls.phone.value("111111111");
    // console.log(event.target.value);
  }

  onSubmitOtp() {
    const controls = this.otpForm.controls;
    if (this.otpForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.accountName = controls.accountName.value;
    this.loadingOtp = true;
    this.auth.requestOTP(this.accountName).pipe(
      tap(response => {
        if (response) {
          const body = response.body;
          this.threeLastNumber = body.phoneNumber.substr(body.phoneNumber.length - 3)
          this.timer$ = null;
          this.componentDestroyed$.next(true)
          this.componentDestroyed$.complete()
          this.otp = '1';
          this.notiService.showNoti(this.translate.instant('AUTH.OTP.REQUEST_SUCCESS'), 'success');
          this.loadingOtp = false;
          // this.modalRef.hide()
          this.resetCount()
          this.otpInput = ''
          this.timer$ = timer(0, 1000).pipe(
            takeUntil(this.componentDestroyed$),
            scan(acc => --this.counter, this.counter),
            takeWhile(x => x >= 0)
          ).subscribe(() => this.cdr.detectChanges());
          // this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
        } else {
          this.notiService.showNoti(this.translate.instant('AUTH.OTP.REQUEST_FAILURE'), 'warning');
          this.loadingOtp = false;
        }
      }, error => {
        this.notiService.showNoti(error.error.detail, 'error');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.loadingOtp = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  verifyOtp() {
    const controls = this.verifyOTPForm.controls;
    if (this.verifyOTPForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    if (controls.otpNumber1.value && controls.otpNumber2.value && controls.otpNumber3.value &&
      controls.otpNumber4.value && controls.otpNumber5.value && controls.otpNumber6.value) {
      this.otpInput = controls.otpNumber1.value + '' + controls.otpNumber2.value + '' + controls.otpNumber3.value
        + '' + controls.otpNumber4.value + '' + controls.otpNumber5.value + '' + controls.otpNumber6.value;
    } else {
      return
    }

    this.loadingVerifyOtp = true;
    this.auth.verifyOTP(this.accountName, this.otpInput).pipe(
      tap(response => {
        if (response) {
          console.log('data passwordReset ===>', response.body)
          this.passwordReset = response.body;
          this.notiService.showNoti(this.translate.instant('AUTH.FORGOT.SUCCESS'), 'success');
          this.loadingVerifyOtp = false;
          // this.modalRef.hide()
          this.removeCount()
          this.verifySuccess = true;
          // this.phoneNumber = '';vcvcv
        } else {
          this.notiService.showNoti(this.translate.instant('AUTH.OTP.FAILURE'), 'warning');
          this.loadingVerifyOtp = false;
        }
      }, error => {
        this.notiService.showNoti(error.error.detail, 'error');
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.loadingVerifyOtp = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
    this.cdr.detectChanges();
  }

  onCancelOtp() {
    this.modalRef.hide()
    this.resetValue();
  }

  resetValue() {
    this.otp = ''
    this.passwordReset = ''
    this.verifySuccess = false;
    this.numberOtpInput = 0;
  }

  resetCount() {
    this.counter = 120
  }

  removeCount() {
    this.counter = null
  }

  restart() {
    console.log(this.counter)
  }

  onDigitInput(event) {
    let element;
    const regex = /^-?([0-9]\d*)?$/;
    if (event.code !== 'Backspace') {
      if (event.key.trim() !== '' && event.key.trim().match(regex)) {
        this.numberOtpInput < 6 ? this.numberOtpInput++ : this.numberOtpInput = 6
        element = event.srcElement.nextElementSibling;
      } else {
        element = null
      }
    }
    if (event.code === 'Backspace') {
      this.numberOtpInput > 0 ? this.numberOtpInput-- : this.numberOtpInput = 0
      element = event.srcElement.previousElementSibling;
    }
    if (element == null)
      return;
    else
      element.focus();
  }

  replaceSpacePassword(event: any) {
    const data = event.target.value.replace(/\s/g, '')
    this.loginForm.patchValue({
      password: data,
    });
    if (data === '') {
      event.target.type = 'password';
      this.toggle1 = false;
      return this.loginForm.controls['password'].setErrors({isNull: true})
    }
    return null;
  }

  replaceSpaceUserName(event: any) {
    const data = event.target.value.replace(/\s/g, '')
    this.loginForm.patchValue({
      phone: data,
    });
    if (data === '') {
      return this.loginForm.controls['phone'].setErrors({isNullUser: true})
    }
    return null;
  }
}


// @Pipe({
//   name: 'formatTime'
// })
// export class FormatTimePipe implements PipeTransform {
//   transform(value: number): string {
//     return (
//       ('' + Math.floor(value)).slice(-3)
//     );
//   }
// }
