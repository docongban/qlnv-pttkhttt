import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTimekeepingComponent } from './create-update-timekeeping.component';

describe('CreateUpdateTimekeepingComponent', () => {
  let component: CreateUpdateTimekeepingComponent;
  let fixture: ComponentFixture<CreateUpdateTimekeepingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateTimekeepingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateTimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
