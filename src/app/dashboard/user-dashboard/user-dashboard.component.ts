import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { dashboard } from 'src/app/models/dashboard-details';
import { instructionJson } from 'src/app/models/instruction-form';
import { saveAs as importedSaveAs } from "file-saver";
import { InstructionFormComponent } from '../instruction-form/instruction-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { variableFields } from 'src/app/models/variable-fields';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['Instance Name', 'Execution Date', 'Instruction', 'Actions'];
  progressMode = "indeterminate";
  dataSource: any
  dashboardList: dashboard[];
  resultsLength = 0;
  datasourceLoaded = true;
  showForm = false;
  instructionForm: FormGroup;
  instruction: instructionJson;
  sampleFileUploadFlag: boolean = false;
  inputType = 'Form Input';
  step = 1;
  variableRecord: variableFields[] = []
  variableFieldButton = "Add Variable Fields";
  addVariableFlag = false;
  formHeading='Edit Instruction for Data Generation Instance'
  currentTestName=''
  currentTestTime:Date;
  isDisabled:boolean=false;
  @ViewChild(InstructionFormComponent)
  private childComponent: InstructionFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder) {
    this.matIconRegistry.addSvgIcon(
      'download',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/download-icon.svg')
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
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
      downloadFile: [''],
      inputType: ['']
    })
    this.dashboardList = JSON.parse(localStorage.getItem('dashboard'));
    if (this.dashboardList != null || this.dashboardList != undefined) {
      this.dataSource = new MatTableDataSource<dashboard>(this.dashboardList);
      this.resultsLength = this.dashboardList.length
      this.progressMode = "determinate";
    }
    else {
      this.datasourceLoaded = false;
    }
  }
  downloadInstruction(instruction: instructionJson) {
    const jsn = JSON.stringify(instruction);
    const blob = new Blob([jsn], { type: 'application/json' });
    const file = new File([blob], 'file.json');
    importedSaveAs(blob, 'instruction.json');
  }
  showInstruction(instruction,testName,testTime,disabledFlag) {
    this.currentTestName=testName
    this.currentTestTime=testTime
    this.showForm = true;
    this.instruction = JSON.parse(instruction);
    var sampleFileHeader = false
    var isFileLocal = true
    if (this.instruction.sampleFileHeader == 'True')
      sampleFileHeader = true;
    if (this.instruction.isFileLocal == 'False')
      isFileLocal = false;
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
      isFileLocal: isFileLocal,
      sampleFileHeader: sampleFileHeader,
      inputType:'Form Input'
    })
    if (this.instruction['variableRecords'] != null || this.instruction['variableRecords'] != undefined) {
      this.variableFieldButton = "Edit Variable Details";
      this.addVariableFlag = true;
      this.variableRecord = this.instruction['variableRecords'];
    }
    if(disabledFlag){
      this.variableFieldButton = "Show Variable Details";
      this.formHeading="Read only details for Data Generation Instance"
      this.instructionForm.disable()
      this.isDisabled=true;
    }
  }
  addVariableFields(){
    this.childComponent.addVariableFields();
  }
  nextStep(){
    this.childComponent.nextStep();
  }

  onSampleFileChange(event) {
    this.sampleFileUploadFlag = true;
    this.childComponent.onSampleFileChange(event);
    console.log(this.sampleFileUploadFlag);
  }

  onSampleFileUpload() {
    this.childComponent.onSampleFileUpload();
  }
}
