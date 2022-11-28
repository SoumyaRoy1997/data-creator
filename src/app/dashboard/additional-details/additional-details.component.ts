import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./additional-details.component.scss']
})
export class AdditionalDetailsComponent implements OnInit {

  file: File = null;
  fileUploaded:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<AdditionalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  onChange(event) {
    this.file = event.target.files[0];
  }
  onUpload(event: Event,type:string) {
    var selectedFile = this.file;
    console.log(this.fileUploaded);
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    fileReader.onload = () => {
     if(type == "Mapping"){
       
     }
     else{

     }
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}
