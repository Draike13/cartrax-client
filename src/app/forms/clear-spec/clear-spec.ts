import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Api } from '../../services/api';

@Component({
  selector: 'app-clear-spec',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './clear-spec.html',
  styleUrl: './clear-spec.css',
})
export class ClearSpec {
  constructor(
    private dialogRef: MatDialogRef<ClearSpec>,
    private apiService: Api
  ) {}

  async clearSpec() {
    const currentSpec = this.apiService.selectedSpec()?.car_spec;
    if (!currentSpec) return;

    const clearedValues: any = {};

    // Loop over every property in the spec
    for (const key of Object.keys(currentSpec)) {
      clearedValues[`${key}_id`] = null;
    }

    try {
      await this.apiService.updateCarSpec(
        this.apiService.selectedCarId()!,
        clearedValues
      );
      this.apiService.updateSpecs.set(true); // trigger reload
      this.dialogRef.close();
      console.log('Spec sheet cleared successfully!');
    } catch (err) {
      console.error('Error clearing spec sheet', err);
    }
  }
}
