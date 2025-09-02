import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'ecommerce-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.sass'
})
export class InfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { infoMessage: string, infoButton: string }
  ) {
  }

  onAction(): void {
    this.dialogRef.close();
  }

}
