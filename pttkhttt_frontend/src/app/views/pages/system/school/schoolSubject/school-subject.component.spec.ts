import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSubjectComponent } from './school-subject.component';

describe('SchoolSubjectComponent', () => {
  let component: SchoolSubjectComponent;
  let fixture: ComponentFixture<SchoolSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
