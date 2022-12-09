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
import { dashboard } from '../models/dashboard-details';

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
  actualInputType = 'Form Input';
  addVariableFlag = false;
  dashboardList: dashboard[];
  datasourceLoaded: boolean = false;
  scrapedDashboardList: dashboard[] = [];
  variableRecord: variableFields[] = []
  currentTestName = ''
  currentTestTime: Date;
  showForm = false;
  formHeading='Create Data'

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
    this.dashboardList = JSON.parse(localStorage.getItem('dashboard'));
    if (this.dashboardList != null && this.dashboardList != undefined && this.dashboardList.length > 0) {
      this.datasourceLoaded = true;
      var counter = 0;
      for (let index = this.dashboardList.length - 1; index >= 0; index--) {
        if (counter == 3)
          break;
        this.scrapedDashboardList.push(this.dashboardList[index]);
        counter++;
      }
    }
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
      folders: ['1'],
      files: ['', Validators.required],
      records: ['', Validators.required],
      sampleFileHeader: [''],
      isFileLocal: ['False'],
      indent: [''],
      delimiter: [''],
      sparkConfFile: [''],
      downloadFile: [''],
      inputType: ['']
    })
  }

  setInstructionForm(event) {
    this.instructionForm = event;
  }

  showInstruction(instruction,testName,testTime) {
    this.currentTestName = testName
    this.currentTestTime = testTime
    this.instruction = JSON.parse(instruction);
    var sampleFileHeader = false
    if (this.instruction.sampleFileHeader == 'True')
      sampleFileHeader = true;
    this.instructionForm.patchValue({
      sampleFilename: this.instruction.sampleFilename,
      fileType: this.instruction.fileType,
      fileLocation: this.instruction.fileLocation,
      outputFolder: this.instruction.outputFolder,
      outputFilename: this.instruction.outputFilename,
      folders: this.instruction.folders,
      files: this.instruction.files,
      records: this.instruction.records,
      indent: this.instruction.indent,
      isFileLocal: this.instruction.isFileLocal,
      sampleFileHeader: sampleFileHeader,
      inputType:'Form Input'
    })
    if (this.instruction['variableRecords'] != null || this.instruction['variableRecords'] != undefined) {
      this.variableFieldButton = "Edit Variable Details";
      this.addVariableFlag = true;
      this.variableRecord = this.instruction['variableRecords'];
    }
    this.formHeading='Edit Instruction for Data Generation Instance:'
    this.showForm = true;
  }

  createData() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.instanceName = this.dashboardForm.get('instanceName').value;
      this.formHeading='Create Data'
    }
    else{
      this.dashboardForm.reset();
      this.currentTestName=''
      this.currentTestTime=null
    }
  }
}
