import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { dashboard } from 'src/app/models/dashboard-details';
import { instructionJson } from 'src/app/models/instruction-form';
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  displayedColumns: string[] = ['Instance Name', 'Execution Date', 'Instruction', 'Actions'];
  progressMode = "indeterminate";
  dataSource: any
  dashboardList: dashboard[];
  resultsLength = 0;
  datasourceLoaded = true;
  showForm = false;
  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'download',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/download-icon.svg')
    );
  }

  ngOnInit(): void {
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
  // showDashboard(instruction:instructionJson){
  //   this.showForm=true;
  //   //this.childComponent.instruction=instruction;
  //   this.childComponent.setStep(0);
  //   this.childComponent.nextStep();
  // }
}
