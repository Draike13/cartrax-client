import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../services/dialog';
import { AddCar } from '../forms/add-car/add-car';
import { EditCar } from '../forms/edit-car/edit-car';
import { SearchCar } from '../forms/search-car/search-car';
import { AddPart } from '../forms/add-part/add-part';
import { EditPart } from '../forms/edit-part/edit-part';
import { EditSpec } from '../forms/edit-spec/edit-spec';

@Component({
  selector: 'app-input-dialog',
  imports: [AddCar, EditCar, SearchCar, AddPart, EditPart, EditSpec],
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
