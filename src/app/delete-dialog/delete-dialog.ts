import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../services/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';

@Component({
  selector: 'app-delete-dialog',
  imports: [MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.css',
})
export class DeleteDialog {
  vin: string;
  userInput = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteDialog>,
    private dialogService: Dialog,
    private apiService: Api
  ) {
    this.vin = this.dialogService.selectedCar()!.vin;
  }

  matchesVin() {
    return this.userInput.trim().toUpperCase() === this.vin.toUpperCase();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.apiService
      .deleteCar(this.dialogService.selectedCar()!.id)
      .then(() => {
        console.log('Car deleted successfully');
        this.dialogRef.close(true);
      })
      .catch((error) => {
        console.error('Error deleting car:', error);
        this.dialogRef.close(false);
      });
    this.dialogRef.close(true);
  }
}
