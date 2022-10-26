import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataPackageComponent } from './create-data-package.component';

describe('CreateDataPackageComponent', () => {
  let component: CreateDataPackageComponent;
  let fixture: ComponentFixture<CreateDataPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDataPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDataPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
