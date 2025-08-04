import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Dialog } from '../../services/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-car',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-car.html',
  styleUrl: './edit-car.css',
})
export class EditCar {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private dialogService: Dialog,
    private dialogRef: MatDialogRef<EditCar>
  ) {
    this.form = this.fb.group({
      vin: [this.dialogService.selectedCar()!.vin, Validators.required],
      make: [this.dialogService.selectedCar()!.make, Validators.required],
      model: [this.dialogService.selectedCar()!.model, Validators.required],
      year: [this.dialogService.selectedCar()!.year, Validators.required],
      trim: [this.dialogService.selectedCar()!.trim, Validators.required],
      color: [this.dialogService.selectedCar()!.color, Validators.required],
      mileage: [this.dialogService.selectedCar()!.mileage, Validators.required],
      notes: [this.dialogService.selectedCar()!.notes || ''],
    });
  }

  submit() {
    if (this.form.invalid) return;

    console.log('Alteration submitted', this.form.value);
    this.apiService.updateCar(
      this.dialogService.selectedCar()!.id,
      this.form.value
    );
    this.dialogRef.close();
    this.dialogService.viewType.set(null);
  }
  cancel() {
    this.dialogRef.close();
    this.dialogService.viewType.set(null);
  }
}
