import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { instructionJson } from 'src/app/models/instruction-form';

@Component({
  selector: 'app-upload-instruction-form',
  templateUrl: './upload-instruction-form.component.html',
  styleUrls: ['./upload-instruction-form.component.scss']
})
export class UploadInstructionFormComponent implements OnInit {

  @Output() uploadFileEvent = new EventEmitter<instructionJson>();
  @Input() instruction: instructionJson;
  @Input() inputType = 'Upload File';
  @Input() step = 0;
  file: File = null;
  fileUploaded: boolean = false;
  @ViewChild('instructionInput') myInputVariable: ElementRef<HTMLInputElement>;
  constructor() { }

  ngOnInit(): void {
  }
  
  onChange(event) {
    this.file = event.target.files[0];
  }
  onUpload() {
    var selectedFile = this.file;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF - 8");
    fileReader.onload = () => {
      // this.fileUploaded = true;
      this.instruction = (JSON.parse(fileReader.result.toString()));
      //this.myInputVariable.nativeElement.value = ""
      this.uploadFileEvent.emit(this.instruction)
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}
