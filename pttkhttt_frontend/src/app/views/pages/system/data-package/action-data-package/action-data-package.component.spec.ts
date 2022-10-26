import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDataPackageComponent } from './action-data-package.component';

describe('ActionDataPackageComponent', () => {
  let component: ActionDataPackageComponent;
  let fixture: ComponentFixture<ActionDataPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionDataPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDataPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
