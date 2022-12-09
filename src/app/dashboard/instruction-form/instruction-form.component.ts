import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfirmationWindowComponent } from 'src/app/common/confirmation-window/confirmation-window.component';
import { ProgressSpinnerComponent } from 'src/app/common/progress-spinner/progress-spinner.component';
import { dashboard } from 'src/app/models/dashboard-details';
import { instructionJson } from 'src/app/models/instruction-form';
import { registration } from 'src/app/models/registration-form';
import { variableFields } from 'src/app/models/variable-fields';
import { DashboardService } from 'src/app/service/dashboard.service';
import { LoginService } from 'src/app/service/login.service';
import { InstructionService } from '../../service/instruction.service';
import Swal from 'sweetalert2';
import { VariableFieldsComponent } from '../variable-fields/variable-fields.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-instruction-form',
  templateUrl: './instruction-form.component.html',
  styleUrls: ['./instruction-form.component.scss']
})
export class InstructionFormComponent implements OnInit {
  @Input() step = 0;
  @Input() inputType = 'Form Input';
  @Input() actualInputType = 'Form Input';
  sampleFileData: string = '';
  @Input() instructionForm: FormGroup;
  @Input() instruction: instructionJson;
  @Input() variableRecord: variableFields[] = []
  @Input() variableFieldButton = "Add Variable Fields";
  @Input() instanceName = "";
  username: string = ''
  @Input() sampleFileUploadFlag: boolean = false;
  @Input() addVariableFlag: boolean;
  @Input() fileUploaded: boolean = false;
  file: File = null;
  sampleFile: File = null;
  @Input() isDisabled = false;
  @ViewChild('sampleFileInput') sampleInputVariable: ElementRef<HTMLInputElement>;
  @Input() fileLocationFlag: boolean = false;
  subscription: Subscription;
  @Output() showFormEvent = new EventEmitter<boolean>();
  @Input() formHeading: string;
  @Input() currentTestTime: Date;
  @Input() currentTestName: string;
  sampleFileProcessed:boolean=false;
  columnList = [];
  valueList = [];
  sampleFileColumnList: variableFields[] = [];

  fileTypeList = [{ 'fileType': "CSV", "value": "csv" },
  { 'fileType': "JSON", "value": "json" },
  { 'fileType': "PNR", "value": "pnr" },
  { 'fileType': "XLSX", "value": "xlsx" },
  { 'fileType': "XML", "value": "xml" },
  { 'fileType': "ORC", "value": "orc" },
  { 'fileType': "PARQUET", "value": "parquet" }
  ]

  constructor(private dashboardService: DashboardService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public instructionService: InstructionService
  ) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('currentUser'))['username']
    console.log(this.instructionForm)
    this.instructionForm.patchValue({
      outputFilename: this.instanceName || this.instructionForm.get('outputFilename').value
    })
    this.subscription = this.instructionService.getInstruction().subscribe(data => {
      if (data) {
        this.instruction = data;
        console.log(this.instruction)
        if (this.instruction['variableRecords'] != null || this.instruction['variableRecords'] != undefined) {
          this.variableFieldButton = "Edit Variable Details";
          this.addVariableFlag = true;
          this.variableRecord = this.instruction['variableRecords'];
        }
      }
    });
  }

  fileUpload(event) {
    //this.fileUploaded = true;
    this.instruction = event;
    //this.fileLocationFlag = true;
    this.nextStep();
  }
  nextStep() {
    console.log(this.instruction)
    this.instructionForm.get('inputType').setValue('Form Input')
    var sampleFileHeader = false
    if (this.instruction.sampleFileHeader)
      sampleFileHeader = true;
    if (this.instructionForm.get('downloadFile').value == 'True') {
      this.instruction.outputFolder = this.instruction.outputFilename || this.instanceName;
    }
    this.instructionForm.patchValue({
      sampleFilename: this.instruction.sampleFilename,
      fileType: this.instruction.fileType,
      fileLocation: this.instruction.fileLocation,
      outputFolder: this.instruction.outputFolder,
      //outputFilename: this.instruction.outputFilename,
      folders: this.instruction.folders,
      files: this.instruction.files,
      records: this.instruction.records,
      indent: this.instruction.indent,
      delimiter: this.instruction.delimiter,
      isFileLocal: this.instruction.isFileLocal,
      sampleFileHeader: sampleFileHeader,
      downloadFile: this.instruction.downloadFile
    })
    if (this.instruction['variableRecords'] != null || this.instruction['variableRecords'] != undefined) {
      this.variableFieldButton = "Edit Variable Details";
      this.addVariableFlag = true;
      this.variableRecord = this.instruction['variableRecords'];
      console.log(this.variableRecord)
    }
  }

  postInstructionFile(instructionRequest: instructionJson) {
    let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.dashboardService.postInstructionFile(instructionRequest).subscribe(data => {
      var date = new Date();
      this.instanceName = this.instanceName || instructionRequest.outputFilename || instructionRequest.outputFolder
      var dashboardRequest = { "dataGenInstanceName": this.instanceName, "executionDate": date, "instructionfile": JSON.stringify(instructionRequest) }
      var userDetails: registration = { "username": this.username, dashboard: [dashboardRequest] }
      this.instructionForm.reset();
      this.instructionForm.markAsUntouched();
      this.sampleFileUploadFlag = false;
      this.addVariableFlag = false;
      this.fileUploaded = false;
      this.variableFieldButton = "Add Variable Fields";
      this.file = null;
      this.sampleFile = null;
      this.loginService.editProfile(userDetails).subscribe(data => {
        var dashboardDetails: dashboard[] = JSON.parse(localStorage.getItem('dashboard'))
        dashboardDetails.push(dashboardRequest)
        localStorage.setItem('dashboard', JSON.stringify(dashboardDetails));
      })
      dialogRef.close();
      if (!data['cloudFlag']) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-warning'
          },
          buttonsStyling: true,
        });
        swalWithBootstrapButtons.fire(
          {
            showCloseButton: true,
            title: 'Download File',
            text: 'Do you want to download your file?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: false,
          }
        ).then((result) => {
          if (result.value) {
            window.location.href = data['fileLocation']
            return;
          }
          console.log('cancel');
        });
      }
      else {
        Swal.fire('Your data generation was completed Successfully! ', 'File Location: ' + data['fileLocation'], 'success');
      }
      this.showFormEvent.emit(false)
    }, error => {
      Swal.fire("User", 'Your data generation was not completed ', 'error');
      dialogRef.close();
    })
  }

  onSampleFileChange(event) {
    this.sampleFile = event.target.files[0];
    this.sampleFileUploadFlag = true;
    this.columnList = [];
    this.valueList = [];
    this.sampleFileColumnList= [];
    console.log(this.sampleFileUploadFlag);
  }

  onSampleFileUpload() {
    if (this.instructionForm.get('fileType').value == '') {
      this.snackBar.open("Select the file type first", "warn", {
        duration: 2000,
      });
    }
    else {
      var selectedFile = this.sampleFile;
      const fileReader = new FileReader();
      var fileSuffix = Date.now()
      fileReader.readAsText(selectedFile, "UTF - 8");
      fileReader.onload = () => {
        this.sampleFileUploadFlag = !this.sampleFileUploadFlag
        this.sampleInputVariable.nativeElement.value = null
        if (this.instructionForm.get('fileType').value == 'json') {
          this.sampleFileData = (JSON.parse(fileReader.result.toString()));
          var request = { "type": "json", "usage": "sample", "data": this.sampleFileData, "filename": this.sampleFile.name.replace(".", "-" + fileSuffix + ".") };
          this.columnList = Object.keys(this.sampleFileData);
          this.valueList = Object.values(this.sampleFileData)
        }
        else {
          this.sampleFileData = fileReader.result.toString();
          let lines = fileReader.result.toString().split(/\r|\n|\r/);
          this.columnList = lines[0].split(',');
          this.valueList = lines[2].split(',');
          var request = { "type": "csv", "usage": "sample", "data": this.sampleFileData, "filename": this.sampleFile.name.replace(".", "-" + fileSuffix + ".") };
        }
        for (let index = 0; index < this.columnList.length; index++) {
          let sampleRecord: variableFields = { "columnName": this.columnList[index], "sampleData": this.valueList[index], "columnIndex": index.toString(), "isMapped": "False" }
          this.sampleFileColumnList.push(sampleRecord);
        }
        let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
          panelClass: 'transparent',
          disableClose: true
        });
        this.dashboardService.uploadSampleFile(request).subscribe(data => {
          this.instructionForm.patchValue({
            isFileLocal: 'False',
            fileLocation: data['message']
          })
          this.instructionForm.get("isFileLocal").setValue('False');
          this.instructionForm.get("fileLocation").setValue(data['message'])
          dialogRef.close();
          this.sampleFileProcessed=true;
          this.snackBar.open("Sample File Uploaded", "Success", {
            duration: 2000,
          });
        }, error => {
          dialogRef.close();
        })
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    }
  }

  onChange(event) {
    this.file = event.target.files[0];
  }
  onUpload() {
    var selectedFile = this.file;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    fileReader.onload = () => {
      this.fileUploaded = true;
      this.instruction = (JSON.parse(fileReader.result.toString()));
      this.step = 2;
      this.nextStep();
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  addVariableFields() {
    var data={ "variableRecord": this.variableRecord, "instanceName": this.instanceName, "isDisabled": this.isDisabled }
    if(this.sampleFileProcessed){
      var data={ "variableRecord": this.sampleFileColumnList, "instanceName": this.instanceName, "isDisabled": this.isDisabled }
    }
    const dialogRef = this.dialog.open(VariableFieldsComponent, {
      width: 'auto',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.variableRecord = result;
      if (result !== undefined) {
        this.variableFieldButton = "Edit Variable Details";
        this.addVariableFlag = true;
        var isFileLocal = 'False';
        if (this.instructionForm.get('isFileLocal').value == 'True')
          isFileLocal = 'True';
        var sampleFileHeader = 'False';
        if (this.instructionForm.get('sampleFileHeader').value)
          sampleFileHeader = 'True';
        this.instruction = {
          "sampleFilename": this.instructionForm.get("sampleFilename").value,
          "fileType": this.instructionForm.get("fileType").value,
          "fileLocation": this.instructionForm.get("fileLocation").value,
          "outputFolder": this.instructionForm.get("outputFolder").value,
          "outputFilename": this.instructionForm.get("outputFilename").value,
          "folders": this.instructionForm.get("folders").value,
          "files": this.instructionForm.get("files").value,
          "records": this.instructionForm.get("records").value,
          "indent": this.instructionForm.get("indent").value,
          "isFileLocal": isFileLocal,
          "delimiter": this.instructionForm.get('delimiter').value,
          "sampleFileHeader": sampleFileHeader,
          "variableRecords": this.variableRecord,
          "downloadFile": this.instructionForm.get('downloadFile').value
        }
      }
      else
        console.log("Null Value")
    });
  }


  // addVariableFields() {
  //   if (this.sampleFileProcessed) {
  //     this.variableRecord= this.sampleFileColumnList
  //   }
  //   this.variableFieldButton = "Edit Variable Details";
  //   this.addVariableFlag = true;
  //   // var isFileLocal = 'False';
  //   // if (this.instructionForm.get('isFileLocal').value == 'True')
  //   //   isFileLocal = 'True';
  //   // var sampleFileHeader = 'False';
  //   // if (this.instructionForm.get('sampleFileHeader').value)
  //   //   sampleFileHeader = 'True';
  //   // this.instruction = {
  //   //   "sampleFilename": this.instructionForm.get("sampleFilename").value,
  //   //   "fileType": this.instructionForm.get("fileType").value,
  //   //   "fileLocation": this.instructionForm.get("fileLocation").value,
  //   //   "outputFolder": this.instructionForm.get("outputFolder").value,
  //   //   "outputFilename": this.instructionForm.get("outputFilename").value,
  //   //   "folders": this.instructionForm.get("folders").value,
  //   //   "files": this.instructionForm.get("files").value,
  //   //   "records": this.instructionForm.get("records").value,
  //   //   "indent": this.instructionForm.get("indent").value,
  //   //   "isFileLocal": isFileLocal,
  //   //   "delimiter": this.instructionForm.get('delimiter').value,
  //   //   "sampleFileHeader": sampleFileHeader,
  //   //   "variableRecords": this.variableRecord,
  //   //   "downloadFile": this.instructionForm.get('downloadFile').value
  //   // }
  // }
  createInstrcutionRequest() {
    console.log(this.instructionForm);
    if (this.instructionForm.valid) {
      console.log("Hi")
      console.log(this.instructionForm)
      var isFileLocal = 'False';
      if (this.instructionForm.get('isFileLocal').value) {
        isFileLocal = 'False';
      }
      var sampleFileHeader = 'False';
      if (this.instructionForm.get('sampleFileHeader').value)
        sampleFileHeader = 'True';
      if (this.instructionForm.get('downloadFile').value == 'True') {
        this.instructionForm.get("outputFolder").setValue(this.instructionForm.get("outputFilename").value || this.instanceName);
      }
      this.instruction = {
        "sampleFilename": this.instructionForm.get("sampleFilename").value,
        "fileType": this.instructionForm.get("fileType").value,
        "fileLocation": this.instructionForm.get("fileLocation").value,
        "outputFolder": this.instructionForm.get("outputFolder").value || this.instanceName,
        "outputFilename": this.instructionForm.get("outputFilename").value || this.instanceName,
        "folders": this.instructionForm.get("folders").value,
        "files": this.instructionForm.get("files").value,
        "records": this.instructionForm.get("records").value,
        "indent": this.instructionForm.get("indent").value,
        "delimiter": this.instructionForm.get('delimiter').value,
        "isFileLocal": isFileLocal,
        "sampleFileHeader": sampleFileHeader
      }
      if (this.addVariableFlag)
        this.instruction['variableRecords'] = this.variableRecord;
      console.log(this.instruction)
      this.postInstructionFile(this.instruction);
    }
  }

}
