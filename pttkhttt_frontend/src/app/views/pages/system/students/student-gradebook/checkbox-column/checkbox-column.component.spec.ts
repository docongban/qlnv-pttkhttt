import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxColumnComponent } from './checkbox-column.component';

describe('CheckboxColumnComponent', () => {
  let component: CheckboxColumnComponent;
  let fixture: ComponentFixture<CheckboxColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
