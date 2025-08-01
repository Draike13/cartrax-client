import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Api } from '../../services/api';

@Component({
  selector: 'app-add-car',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-car.html',
  styleUrl: './add-car.css',
})
export class AddCar {
  form: FormGroup;
  constructor(private fb: FormBuilder, private apiService: Api) {
    this.form = this.fb.group({
      vin: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      trim: ['', Validators.required],
      color: ['', Validators.required],
      mileage: ['', Validators.required],
      notes: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;

    console.log('Form Submitted', this.form.value);
    this.apiService.createCar(this.form.value);
  }
}
