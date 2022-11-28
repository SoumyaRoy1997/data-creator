import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-window',
  templateUrl: './confirmation-window.component.html',
  styleUrls: ['./confirmation-window.component.scss']
})
export class ConfirmationWindowComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

}
