import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTimekeepingComponent } from './chart-timekeeping.component';

describe('ChartTimekeepingComponent', () => {
  let component: ChartTimekeepingComponent;
  let fixture: ComponentFixture<ChartTimekeepingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTimekeepingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
