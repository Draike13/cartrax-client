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
import { Part } from '../../models/part-type';

@Component({
  selector: 'app-edit-part',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
  ],
  templateUrl: './edit-part.html',
  styleUrl: './edit-part.css',
})
export class EditPart {
  form: FormGroup;

  partTypes = PART_TYPES;
  filteredPartTypes: string[] = [...PART_TYPES];
  editingPart: Part | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private dialogService: Dialog,
    private dialogRef: MatDialogRef<InputDialog>
  ) {
    this.form = this.fb.group({
      type: [{ value: '', disabled: true }, Validators.required], // locked in edit mode
      data: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.editingPart = this.dialogService.selectedPart();

    if (this.editingPart) {
      this.form.patchValue({
        type: this.editingPart.type,
        data: this.editingPart.data,
      });
      this.filterPartTypes();
    }
  }

  setPartType(type: string) {
    this.form.patchValue({ type });
  }

  /** Filters available part types (though type is locked here) */
  filterPartTypes() {
    const search = (this.form.get('type')?.value || '').toLowerCase();
    this.filteredPartTypes = this.partTypes.filter((type) =>
      type.toLowerCase().includes(search)
    );
  }

  /** Save button clicked */
  submit() {
    if (this.form.invalid || !this.editingPart) return;

    const type = this.editingPart.type;
    const data = this.form.get('data')?.value;

    console.log(`Updating part ${this.editingPart.id} of type ${type}`);
    this.apiService
      .updatePart(type, this.editingPart.id, data)
      .then(() => {
        this.dialogService.selectedPart.set(null);
        this.dialogRef.close(true);
      })
      .catch((err) => {
        console.error('Update failed', err);
      });
  }

  /** Cancel button clicked */
  cancel() {
    this.dialogService.selectedPart.set(null);
    this.dialogRef.close(false);
  }
}
