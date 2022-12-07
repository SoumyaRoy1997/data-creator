import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DashboardService } from '../service/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { instructionJson } from '../models/instruction-form'
import { VariableFieldsComponent } from './variable-fields/variable-fields.component';
import { ConfirmationWindowComponent } from '../common/confirmation-window/confirmation-window.component';
import { variableFields } from '../models/variable-fields';
import { ProgressSpinnerComponent } from '../common/progress-spinner/progress-spinner.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../service/login.service';
import { registration } from '../models/registration-form';
import { InstructionFormComponent } from './instruction-form/instruction-form.component';
import { InstructionPrimaryFormComponent } from './instruction-form/instruction-primary-form/instruction-primary-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  step = 0;
  inputType = 'Form Input';
  sampleFileData: string = '';
  dashboardForm: FormGroup;
  instructionForm: FormGroup;
  variableFieldButton = "Add Variable Fields";
  instanceName = "";
  username: string = ''
  sampleFileUploadFlag: boolean = false;
  fileUploaded: boolean = false;
  instruction: instructionJson;
  actualInputType='Form Input';
  addVariableFlag=false;

  @ViewChild('instructionInput') myInputVariable: ElementRef<HTMLInputElement>;
  @ViewChild('sampleFileInput') sampleInputVariable: ElementRef<HTMLInputElement>;

  @ViewChild(InstructionFormComponent)
  private childComponent: InstructionFormComponent;
  @ViewChild(InstructionPrimaryFormComponent)
  private instructionPrimComp: InstructionPrimaryFormComponent;

  constructor(private fb: FormBuilder,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('currentUser'))['username']
    this.dashboardForm = this.fb.group({
      instanceName: [''],
      generateloc: [''],
      instructionInput: ['']
    });
    this.instructionForm = this.fb.group({
      sampleFilename: [''],
      fileType: ['', Validators.required],
      fileLocation: ['', Validators.required],
      outputFolder: [''],
      outputFilename: [''],
      folders: ['', Validators.required],
      files: ['', Validators.required],
      records: ['', Validators.required],
      sampleFileHeader: [''],
      isFileLocal: [''],
      indent: [''],
      delimiter: [''],
      sparkConfFile: [''],
      downloadFile: [false],
    })
    this.setStep(0);
  }
  uploadFileSetStep(event){
    this.setStep(event)
    this.inputType='Form Input'
  }
  setStep(index: number) {
    this.step = index;
  }
  setInstructionForm(event){
    this.instructionForm=event;
  }
  nextStep() {
    console.log(this.step)
    if (this.step == 0) {
      this.inputType = this.dashboardForm.get("instructionInput").value || 'Form Input'
      this.instanceName = this.dashboardForm.get("instanceName").value || 'Sample'
      if(this.inputType != 'Form Input' )
      this.step=1;
    }
    if (this.step == 1 && this.inputType == 'Form Input') {
      this.instructionPrimComp.nextStep();
    }
    else if(this.step == 1 && this.inputType == 'Upload File'){
      this.inputType='Form Input'
      this.actualInputType='Upload File'
      this.step++;
      return;
    }
    if (this.step == 2) {
      this.childComponent.nextStep();
      return;
    }
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  onUpload(instruction){
    this.instruction=instruction;
    this.fileUploaded=true;
  }
  onSampleFileChange(event) {
    this.sampleFileUploadFlag = true;
    this.childComponent.onSampleFileChange(event);
    console.log(this.sampleFileUploadFlag);
  }

  onSampleFileUpload() {
    this.childComponent.onSampleFileUpload();
  }

  addVariableFields(){
    this.childComponent.addVariableFields();
  }
  onActivate(event){
    event.primaryInput.subscribe((data)=>{
      console.log(event)
      console.log(data)
      this.instructionForm=event;
    })
    event.customInput.subscribe((data)=>{
      console.log(event)
      console.log(data)
      this.instruction=event;
    })
    event.inputFlag.subscribe((data)=>{
      this.addVariableFlag=true;
    })
  }
  setCustomInstruction(event){
    this.instruction=event;
    console.log(event)
  }
}
