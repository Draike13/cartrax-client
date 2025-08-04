import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Api } from '../../services/api';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Dialog } from '../../services/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { InputDialog } from '../../input-dialog/input-dialog';
import { PART_TYPES } from '../../data/part-types';

@Component({
  selector: 'app-add-part',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-part.html',
  styleUrl: './add-part.css',
})
export class AddPart {
  form: FormGroup;

  partTypes = PART_TYPES;
  filteredPartTypes: string[] = [...PART_TYPES];

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private dialogService: Dialog,
    private dialogRef: MatDialogRef<InputDialog>
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      data: ['', Validators.required],
    });
  }

  ngOnInit() {
    const prefillType = this.apiService.selectedPartType();
    if (prefillType) {
      this.form.patchValue({ type: prefillType });
      this.filterPartTypes();
    }
  }

  /** Filters available part types based on user typing */
  filterPartTypes() {
    const search = (this.form.get('type')?.value || '').toLowerCase();
    this.filteredPartTypes = this.partTypes.filter((type) =>
      type.toLowerCase().includes(search)
    );
  }

  /** Called when user picks a part type from dropdown */
  setPartType(type: string) {
    this.form.patchValue({ type });
  }

  /** Save button clicked */
  submit() {
    if (this.form.invalid) return;

    console.log('Saving new part:', this.form.value);
    const type = this.form.value.type;
    const data = this.form.value.data;

    this.apiService
      .createPart(type, data)
      .then(() => {
        this.dialogRef.close(true); // close and tell parent to refresh
      })
      .catch((err) => {
        console.error('Save failed', err);
      });
    this.dialogRef.close(true);
  }

  /** Cancel button clicked */
  cancel() {
    this.dialogRef.close(false);
  }
}
