import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEditSchoolSubjectComponent } from './modal-add-edit-school-subject.component';

describe('ModalAddEditSchoolSubjectComponent', () => {
  let component: ModalAddEditSchoolSubjectComponent;
  let fixture: ComponentFixture<ModalAddEditSchoolSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddEditSchoolSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddEditSchoolSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
