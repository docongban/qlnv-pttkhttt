import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTeacherComponent } from './action-teacher.component';

describe('ActionTeacherComponent', () => {
  let component: ActionTeacherComponent;
  let fixture: ComponentFixture<ActionTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
