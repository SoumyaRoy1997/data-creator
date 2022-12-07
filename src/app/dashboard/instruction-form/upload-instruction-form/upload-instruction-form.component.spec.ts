import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadInstructionFormComponent } from './upload-instruction-form.component';

describe('UploadInstructionFormComponent', () => {
  let component: UploadInstructionFormComponent;
  let fixture: ComponentFixture<UploadInstructionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadInstructionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadInstructionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
