import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableFieldsComponent } from './variable-fields.component';

describe('VariableFieldsComponent', () => {
  let component: VariableFieldsComponent;
  let fixture: ComponentFixture<VariableFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
