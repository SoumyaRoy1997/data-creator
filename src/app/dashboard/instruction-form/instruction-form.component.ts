import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  setStep(index: number) {
    this.step = index;
  }
  fileUpload(event) {
    this.fileUploaded = true;
    this.instruction = event;
    this.fileLocationFlag = true;
    this.nextStep();
  }
  nextStep() {
    console.log("Hi - line 65")
    if (this.step >= 1) {
      if ((this.inputType !== "Form Input" || this.actualInputType == 'Upload File') && this.fileUploaded) {
        const dialogRef = this.dialog.open(ConfirmationWindowComponent, {
          width: 'auto',
          data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'No') {
            this.postInstructionFile(this.instruction);
          }
          else {
            this.actualInputType = 'Form Input'
            this.step = 2;
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
              delimiter: this.instruction.delimiter,
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
      this.createInstrcutionRequest();
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
      this.setStep(2);
      this.file = null;
      this.sampleFile = null;
      console.log(userDetails)
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
        Swal.fire("User", 'Your data generation was completed Successfully! ', 'success');
      }

    }, error => {
      Swal.fire("User", 'Your data generation was not completed ', 'error');
      this.setStep(2);
      dialogRef.close();
    })
  }

  prevStep() {
    this.step--;
  }
  onSampleFileChange(event) {
    this.sampleFile = event.target.files[0];
    this.sampleFileUploadFlag = true;
    console.log(this.sampleFileUploadFlag);
  }

  onSampleFileUpload() {
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
      }
      else {
        this.sampleFileData = fileReader.result.toString();
        console.log(this.sampleFileData);
        var request = { "type": "csv", "usage": "sample", "data": this.sampleFileData, "filename": this.sampleFile.name.replace(".", "-" + fileSuffix + ".") };
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
    const dialogRef = this.dialog.open(VariableFieldsComponent, {
      width: 'auto',
      data: { "variableRecord": this.variableRecord, "instanceName": this.instanceName, "isDisabled": this.isDisabled }
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
          "delimiter": this.instructionForm.get('delimiter').value,
          "sampleFileHeader": sampleFileHeader,
          "variableRecords": this.variableRecord
        }
      }
      else
        console.log("Null Value")
    });
  }

  createInstrcutionRequest() {
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
