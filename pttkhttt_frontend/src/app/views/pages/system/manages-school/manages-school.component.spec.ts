import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagesSchoolComponent } from './manages-school.component';

describe('ManagesSchoolComponent', () => {
  let component: ManagesSchoolComponent;
  let fixture: ComponentFixture<ManagesSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagesSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagesSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
