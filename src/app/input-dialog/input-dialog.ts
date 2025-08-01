import { Component, inject, Signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../services/dialog';
import { AddCar } from '../forms/add-car/add-car';
import { EditCar } from '../forms/edit-car/edit-car';

@Component({
  selector: 'app-input-dialog',
  imports: [AddCar, EditCar],
  templateUrl: './input-dialog.html',
  styleUrl: './input-dialog.css',
})
export class InputDialog {
  readonly view;
  constructor(
    private dialogRef: MatDialogRef<InputDialog>,
    private dialogService: Dialog
  ) {
    this.view = this.dialogService.viewType;
  }

  close() {
    this.dialogRef.close();
  }
}
