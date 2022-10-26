import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticSmsComponent } from './statistic-sms.component';

describe('StatisticSmsComponent', () => {
  let component: StatisticSmsComponent;
  let fixture: ComponentFixture<StatisticSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
