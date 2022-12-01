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
  instruction: instructionJson;
  variableRecord: variableFields[] = []
  variableFieldButton = "Add Variable Fields";
  instanceName = "";
  username: string = ''
  sampleFileUploadFlag: boolean = false;
  addVariableFlag = false;
  fileUploaded: boolean = false;
  file: File = null;
  sampleFile: File = null;

  @ViewChild('instructionInput') myInputVariable: ElementRef<HTMLInputElement>;
  @ViewChild('sampleFileInput') sampleInputVariable: ElementRef<HTMLInputElement>;

  constructor(private dashboardService: DashboardService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private httpClient: HttpClient) { }

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
      outputFolder: ['', Validators.required],
      outputFilename: ['', Validators.required],
      folders: ['', Validators.required],
      files: ['', Validators.required],
      records: ['', Validators.required],
      sampleFileHeader: [''],
      isFileLocal: [''],
      indent: [''],
      sparkConfFile: [''],
    })
    this.setStep(0);
  }

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    if (this.step == 0) {
      this.inputType = this.dashboardForm.get("instructionInput").value || 'Form Input'
      this.instanceName = this.dashboardForm.get("instanceName").value || 'Sample'
    }
    if (this.step == 1) {
      if (this.inputType !== "Form Input" && this.fileUploaded) {
        const dialogRef = this.dialog.open(ConfirmationWindowComponent, {
          width: 'auto',
          data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'No') {
            this.postInstructionFile(this.instruction);
          }
          else {
            this.step = 1;
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
              sampleFileHeader: sampleFileHeader
            })
            if (this.instruction['variableRecords'] != null || this.instruction['variableRecords'] != undefined) {
              this.variableFieldButton = "Edit Variable Details";
              this.addVariableFlag = true;
              this.variableRecord = this.instruction['variableRecords'];
            }
            this.inputType = "Form Input";
          }
        });
      }
      if (this.instructionForm.valid) {
        var isFileLocal = 'False';
        if (this.instructionForm.get('isFileLocal').value) {
          isFileLocal = 'False';
        }
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
          "sampleFileHeader": sampleFileHeader
        }
        if (this.addVariableFlag)
          this.instruction['variableRecords'] = this.variableRecord;
        this.postInstructionFile(this.instruction);
      }
    }
    this.step++;
  }

  postInstructionFile(instructionRequest: instructionJson) {
    let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.dashboardService.postInstructionFile(instructionRequest).subscribe(data => {
      var date = new Date();
      var userDetails: registration = { "username": this.username, dashboard: [{ "dataGenInstanceName": this.instanceName, "executionDate": date, "instructionfile":JSON.stringify(instructionRequest)}] }
      this.instructionForm.reset();
      this.dashboardForm.reset();
      this.instructionForm.markAsUntouched();
      this.dashboardForm.markAsUntouched();
      this.sampleFileUploadFlag = false;
      this.addVariableFlag = false;
      this.fileUploaded = false;
      this.variableFieldButton = "Add Variable Fields";
      this.setStep(0);
      this.file = null;
      this.sampleFile = null;
      console.log(data)
      console.log(userDetails);
      //var executionDate = this.datepipe.transform(date, 'yyyy-MM-dd');
      this.loginService.editProfile(userDetails).subscribe(data=>{console.log(data)})
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
        Swal.fire("User", 'Your data generation was completed Successfully! ', 'success');
      }

    }, error => {
      Swal.fire("User", 'Your data generation was not completed ', 'error');
      this.setStep(0);
      dialogRef.close();
    })
  }

  prevStep() {
    this.step--;
  }
  onSampleFileChange(event) {
    this.sampleFile = event.target.files[0];
    this.sampleFileUploadFlag = true;
  }

  onSampleFileUpload() {
    var selectedFile = this.sampleFile;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    fileReader.onload = () => {
      this.sampleFileUploadFlag = !this.sampleFileUploadFlag
      this.sampleInputVariable.nativeElement.value = null
      if (this.instructionForm.get('fileType').value == 'json') {
        this.sampleFileData = (JSON.parse(fileReader.result.toString()));
        var request = { "type": "json", "usage": "sample", "data": this.sampleFileData, "filename": "" };
      }
      else {
        this.sampleFileData = fileReader.result.toString();
        console.log(this.sampleFileData);
        var request = { "type": "csv", "usage": "sample", "data": this.sampleFileData, "filename": "" };
      }
      let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });
      this.dashboardService.uploadSampleFile(request).subscribe(data => {
        this.instructionForm.patchValue({
          isFileLocal: false,
          fileLocation: data['message']
        })
        this.instructionForm.get("isFileLocal").setValue('False');
        this.instructionForm.get("fileLocation").setValue(data['message'])
        dialogRef.close();
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

  onChange(event) {
    this.file = event.target.files[0];
  }
  onUpload(event: Event) {
    var selectedFile = this.file;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    fileReader.onload = () => {
      this.fileUploaded = true;
      this.instruction = (JSON.parse(fileReader.result.toString()));
      this.myInputVariable.nativeElement.value = ""
      this.nextStep();
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  addVariableFields() {
    const dialogRef = this.dialog.open(VariableFieldsComponent, {
      width: 'auto',
      data: { "variableRecord": this.variableRecord, "instanceName": this.instanceName }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.variableRecord = result;
      if (result !== undefined) {
        this.variableFieldButton = "Edit Variable Details";
        this.addVariableFlag = true;
        var isFileLocal = 'False';
        if (this.instructionForm.get('isFileLocal').value)
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
          "sampleFileHeader": sampleFileHeader,
          "variableRecords": this.variableRecord
        }
      }
      else
        console.log("Null Value")
    });
  }
}
