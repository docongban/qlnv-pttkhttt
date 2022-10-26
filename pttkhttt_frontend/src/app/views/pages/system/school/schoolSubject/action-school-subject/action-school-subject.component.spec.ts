import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSchoolSubjectComponent } from './action-school-subject.component';

describe('ActionShoolComponent', () => {
  let component: ActionSchoolSubjectComponent;
  let fixture: ComponentFixture<ActionSchoolSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionSchoolSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSchoolSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
