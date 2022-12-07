import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { instructionJson } from 'src/app/models/instruction-form';
import { DashboardService } from 'src/app/service/dashboard.service';
import { InstructionService } from 'src/app/service/instruction.service';


@Component({
  selector: 'app-instruction-primary-form',
  templateUrl: './instruction-primary-form.component.html',
  styleUrls: ['./instruction-primary-form.component.scss']
})
export class InstructionPrimaryFormComponent implements OnInit {
  @Input() instructionForm: FormGroup;
  @Input() instruction: instructionJson;
  @Output() primaryInput = new EventEmitter<FormGroup>();
  @Output() customInput = new EventEmitter<instructionJson>();
  @Output() inputFlag = new EventEmitter<boolean>();

  fileTypeList=[{'fileType':"CSV","value":"csv"},
                {'fileType':"JSON","value":"json"},
                {'fileType':"PNR","value":"pnr"},
                {'fileType':"XLSX","value":"xlsx"},
                {'fileType':"XML","value":"xml"},
                {'fileType':"ORC","value":"orc"},
                {'fileType':"PARQUET","value":"parquet"}
               ]

  constructor(private dashboardService: DashboardService,
    public instructionService: InstructionService) { }

  ngOnInit(): void {
  }

  nextStep() {
    if (this.instructionForm.get('fileType').value == 'pnr') {
      this.dashboardService.retrieveInstructionFile('PNR').subscribe(data => {
        this.instruction = data;
        var isFileLocal = true
        var sampleFileHeader = false;
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
        this.instructionService.sendInstruction(this.instruction)
      })
    }

    this.primaryInput.emit(this.instructionForm);
  }
}
