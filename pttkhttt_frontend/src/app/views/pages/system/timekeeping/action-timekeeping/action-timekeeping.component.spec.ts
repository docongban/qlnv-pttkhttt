import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTimekeepingComponent } from './action-timekeeping.component';

describe('ActionTimekeepingComponent', () => {
  let component: ActionTimekeepingComponent;
  let fixture: ComponentFixture<ActionTimekeepingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionTimekeepingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
