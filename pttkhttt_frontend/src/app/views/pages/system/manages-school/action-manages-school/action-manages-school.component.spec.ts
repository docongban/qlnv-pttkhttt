import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionManagesSchoolComponent } from './action-manages-school.component';

describe('ActionManagesSchoolComponent', () => {
  let component: ActionManagesSchoolComponent;
  let fixture: ComponentFixture<ActionManagesSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionManagesSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionManagesSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
