import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionPrimaryFormComponent } from './instruction-primary-form.component';

describe('InstructionPrimaryFormComponent', () => {
  let component: InstructionPrimaryFormComponent;
  let fixture: ComponentFixture<InstructionPrimaryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionPrimaryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionPrimaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
