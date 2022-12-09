import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ProgressSpinnerComponent } from 'src/app/common/progress-spinner/progress-spinner.component';
import { mappedDetails } from 'src/app/models/mapped-details';
import { variableFields } from 'src/app/models/variable-fields';
import { DashboardService } from 'src/app/service/dashboard.service';
import { dashboadFormModel } from '../../models/dashboard-form-model'

@Component({
  selector: 'app-variable-fields',
  templateUrl: './variable-fields.component.html',
  styleUrls: ['./variable-fields.component.scss']
})
export class VariableFieldsComponent implements OnInit {

  variableFieldForm: FormGroup;
  mappedDetailsForm: FormGroup;
  variableFieldGroupForm: FormGroup;
  variableFieldFormArray=this.fb.array([]);;
  variableFieldArray: variableFields[] = [];
  editedVariableArray: variableFields[] = [];
  mappedRecord: mappedDetails;
  variableRecord: variableFields;
  mappedFlag: boolean = false;
  mappedButton: string = "Add Mapped Details";
  mappedValueFlag: boolean = false;
  editFlag: boolean = false;
  dataSource: any;
  editColumnName = "";
  //displayedColumns: string[] = ['checkFlag', 'Column Index','Column Name', 'Column Type', 'Column Length','domain','dateFormat','startDate','decrement','increment','sampleData', 'Mapped Flag', 'Actions'];
  displayedColumns: string[] = ['checkFlag', 'Column Index','Column Name', 'Column Type', 'Column Length','domain','dateFormat','startDate','sampleData'];
  file: File = null;
  fileUploaded: boolean = false;
  mappedFileData = ''
  mappedFilename:string="";
  fileTypeList=[{'fileType':"CSV","value":"csv"},
                {'fileType':"JSON","value":"json"}]

  columnTypes=[{'columnType':"ALPHANUMERIC","value":"alphanumeric"},
               {'columnType':"TEXT","value":"text"},
               {'columnType':"NUMBER","value":"number"},
               {'columnType':"DATE","value":"date"},
               {'columnType':"NUMERIC-TEXT","value":"numeric-text"},
               {'columnType':"EMAIL","value":"email"}]
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<VariableFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dashboadFormModel:dashboadFormModel) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.variableFieldForm = this.fb.group({
      columnName: ['', Validators.required],
      columnType: ['', Validators.required],
      columnIndex: [''],
      columnLength: [''],
      domain: [''],
      dateFormat:[''],
      startDate:[''],
      decrement:[''],
      increment:[''],
      dateChange:[''],
      checkFlag:[''],
      isMapped: [false, Validators.required]
    })
    
    this.mappedDetailsForm = this.fb.group({
      fileLocalCheck: [false],
      mappedFilename: ['', Validators.required],
      mappedFileType: ['', Validators.required],
      mappedFileColumn: [''],
      mappedFileColumnNum: [''],
      mappedFileDelim: [''],
      mappedFileHeader: [false],
    })
    // this.variableFieldArray[0].mappedDetails.
    console.log(this.data)
    if (this.data.variableRecord.length > 0) {
      this.variableFieldArray = this.data.variableRecord;
      console.log(this.variableFieldArray)
      this.dataSource = new MatTableDataSource<variableFields>(this.variableFieldArray);
    }
    if(this.data.isDisabled){
      this.variableFieldForm.disable();
      this.mappedDetailsForm.disable();
    }

    this.data.variableRecord.forEach(element => {
      this.editVariableDetails(element)
      this.variableFieldFormArray.push(this.variableFieldForm)
    });
    console.log(this.variableFieldFormArray)
    this.variableFieldGroupForm= this.fb.group({
      variableFormRecords: this.variableFieldFormArray
    })
    console.log(this.variableFieldGroupForm)
    
    // this.data.variableRecord.forEach(element => {
    //   // const fgs = element.map(dashboadFormModel.asFormGroup);
    //   this.variableFieldFormArray= new FormArray(dashboadFormModel.asFormGroup);
    //   this.variableFieldGroupForm.setControl('variableFields', this.variableFieldFormArray)
    //  });
    // console.log(this.variableFieldFormArray)
    // this.variableFieldFormArray.forEach(variables => {
    //   this.variableFieldGroupForm.setControl('variableFields', variables);
    // });
  }
  get users() {
    return this.variableFieldGroupForm.get('variableFields') as FormArray;
  }

  addMappedDetails(patchFlag: boolean) {
    this.mappedFlag = !this.mappedFlag;
    if (patchFlag)
      this.variableFieldForm.patchValue({
        isMapped: this.mappedFlag
      });
    if (this.mappedFlag)
      this.mappedButton = "Cancel Adding details";
    else
      this.mappedButton = "Add Mapped Details";
  }
  saveMappedDetails() {
    if (this.mappedDetailsForm.get("mappedFileHeader").value)
      var mappedFileHeader = "True"
    else
      var mappedFileHeader = "False"
    this.mappedRecord = {
      "mappedFileColumn": this.mappedDetailsForm.get("mappedFileColumn").value || "",
      "mappedFileColumnNum": this.mappedDetailsForm.get("mappedFileColumnNum").value,
      "mappedFileDelim": this.mappedDetailsForm.get("mappedFileDelim").value,
      "mappedFileHeader": mappedFileHeader,
      "mappedFileType": this.mappedDetailsForm.get("mappedFileType").value || "",
      "mappedFilename": this.mappedDetailsForm.get("mappedFilename").value || ""
    }
    this.mappedValueFlag = true;
    this.addMappedDetails(false);
    console.log(this.mappedRecord);
  }

  saveVariableDetails(index) {
    if (this.editFlag){
      this.saveMappedDetails();
      this.editFlag = false;
    }
    console.log(this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()))
    if (this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("isMapped").value) {
      this.variableRecord = {
        "columnType": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("columnType").value || "",
        "columnName": this.variableFieldArray[index].columnName,
        "columnIndex": this.variableFieldArray[index].columnIndex,
        "sampleData": this.variableFieldArray[index].sampleData,
        "columnLength": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("columnLength").value || "",
        "domain": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("domain").value || "",
        "startDate": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("startDate").value || "",
        "dateFormat": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("dateFormat").value || "",
        "isMapped": "True",
        "mappedDetails": this.mappedRecord
      }
    }
    else {
      this.variableRecord = {
        "columnType": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("columnType").value || "",
        "columnName": this.variableFieldArray[index].columnName,
        "columnIndex": this.variableFieldArray[index].columnIndex,
        "sampleData": this.variableFieldArray[index].sampleData,
        "columnLength": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("columnLength").value || "",
        "domain": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("domain").value || "",
        "startDate": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("startDate").value || "",
        "dateFormat": this.variableFieldGroupForm.get('variableFormRecords').get(index.toString()).get("dateFormat").value || "",
        "isMapped": "False",
      }
    }
    this.mappedValueFlag = false;
    this.editedVariableArray = this.editedVariableArray.filter(value => this.variableRecord.columnName != value.columnName)
    this.editedVariableArray.push(this.variableRecord);
    // this.variableFieldForm.reset();
    // this.mappedDetailsForm.reset();
    this.snackBar.open("Details for column: "+this.variableRecord.columnName+" was saved successfully", "Success", {
      duration: 3000,
    });
    console.log(this.variableRecord)
  }
  editVariableDetails(variableRecord: variableFields) {
    this.editFlag = !this.editFlag;
    this.editColumnName = variableRecord.columnName;
    this.mappedRecord = variableRecord.mappedDetails;
    if (variableRecord.isMapped == "True") {
      this.addMappedDetails(false);
      this.mappedValueFlag = true;
      var mappedFileHeader = false
      if (variableRecord.mappedDetails.mappedFileHeader == "True")
        mappedFileHeader = true
      if(variableRecord.mappedDetails.mappedFilename.includes('s3://'))
        this.mappedDetailsForm.patchValue({fileLocalCheck:false})
      this.mappedDetailsForm.patchValue({
        mappedFileColumn: variableRecord.mappedDetails.mappedFileColumn,
        mappedFileColumnNum: variableRecord.mappedDetails.mappedFileColumnNum,
        mappedFileDelim: variableRecord.mappedDetails.mappedFileDelim,
        mappedFileHeader: mappedFileHeader,
        mappedFileType: variableRecord.mappedDetails.mappedFileType,
        mappedFilename: variableRecord.mappedDetails.mappedFilename,
      });
    }
    else {
      this.mappedValueFlag = false;
    }
    this.variableFieldForm.patchValue({
      columnType: variableRecord.columnType,
      columnName: variableRecord.columnName,
      columnIndex: variableRecord.columnIndex,
      columnLength: variableRecord.columnLength,
      domain: variableRecord.domain,
      isMapped: this.mappedValueFlag,
    });
    if(this.data.isDisabled){
      this.variableFieldForm.disable();
      this.mappedDetailsForm.disable();
    }
  }

  deleteVariableDetails(variableColumnName: string) {
    this.variableFieldArray = this.variableFieldArray.filter(value => variableColumnName != value.columnName)
    this.dataSource = new MatTableDataSource<variableFields>(this.variableFieldArray);
  }

  onChange(event) {
    this.file = event.target.files[0];
    this.mappedFilename=this.file.name;
    this.fileUploaded=true;
  }
  onUpload(event, type: string) {
    var selectedFile = this.file;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    var fileSuffix=this.variableFieldForm.get('columnName').value || this.mappedDetailsForm.get('mappedFileColumn').value
    fileReader.onload = () => {
      this.fileUploaded=false;
      if (this.mappedDetailsForm.get('mappedFileType').value == 'json') {
        this.mappedFileData = (JSON.parse(fileReader.result.toString()));
        var request = { "type": "json", "usage":"mapping","data": this.mappedFileData ,"filename":this.mappedFilename.replace(".","-"+fileSuffix+".")};
      }
      else {
        this.mappedFileData = fileReader.result.toString();
        var request = { "type": "csv", "usage":"mapping","data": this.mappedFileData ,"filename":this.mappedFilename.replace(".","-"+fileSuffix+".")};
      }
      let dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(ProgressSpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });
      this.dashboardService.uploadSampleFile(request).subscribe(data => {
        console.log(data)
        this.variableFieldForm.patchValue({
          isFileLocal: false,
          fileLocation: data['message']
        })
        this.mappedDetailsForm.get("fileLocalCheck").setValue('False');
        this.mappedDetailsForm.get("mappedFilename").setValue(data['message'])
        dialogRef.close();
        this.snackBar.open("Sample File Uploaded", "Success", {
          duration: 2000,
        });
      },error=>{
        dialogRef.close();
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}
