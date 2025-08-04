import { Component, signal, WritableSignal } from '@angular/core';
import { SearchMode } from '../../models/seach-mode';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InputDialog } from '../../input-dialog/input-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Api } from '../../services/api';
import { Dialog } from '../../services/dialog';

@Component({
  selector: 'app-search-car',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './search-car.html',
  styleUrl: './search-car.css',
})
export class SearchCar {
  searchMode: WritableSignal<SearchMode> = signal('choose');

  vinForm: FormGroup;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InputDialog>,
    private apiService: Api,
    private dialogService: Dialog
  ) {
    this.vinForm = this.fb.group({
      vin: ['', Validators.required],
    });

    this.filterForm = this.fb.group({
      year: [''],
      make: [''],
      model: [''],
    });
  }

  setSearchMode(mode: SearchMode) {
    this.searchMode.set(mode);
  }
  resetSearchMode() {
    this.searchMode.set('choose');
    this.vinForm.reset();
    this.filterForm.reset();
  }
  searchByVin() {
    if (this.vinForm.invalid) return;
    const vin = this.vinForm.value.vin;
    this.dialogRef.close({ type: 'vin', vin });
    this.resetSearchMode();
  }
  searchByFilter() {
    const filters = this.filterForm.value;
    this.dialogRef.close({ type: 'filter', ...filters });
  }

  async submitVinSearch() {
    if (this.vinForm.valid) {
      const vinValue = this.vinForm.value.vin?.trim();
      if (vinValue) {
        const cars = await this.apiService.searchByVin(vinValue);
        this.apiService.cars.set([cars]);
        this.dialogRef.close();
        this.resetSearchMode();
        this.dialogService.searchActive.set(true);
      }
    }
  }

  async submitFilterSearch() {
    if (this.filterForm.valid) {
      const { year, make, model } = this.filterForm.value;
      const cars = await this.apiService.searchByFilter(year, make, model);
      this.apiService.cars.set(cars);
      this.dialogRef.close();
      this.resetSearchMode();
      this.dialogService.searchActive.set(true);
    }
  }
}
