import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchoolProvinceComponent } from './list-school-province.component';

describe('ListSchoolProvinceComponent', () => {
  let component: ListSchoolProvinceComponent;
  let fixture: ComponentFixture<ListSchoolProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSchoolProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSchoolProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
