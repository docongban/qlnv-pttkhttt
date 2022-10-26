import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionStaticComponent } from './action-static.component';

describe('ActionStaticComponent', () => {
  let component: ActionStaticComponent;
  let fixture: ComponentFixture<ActionStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
