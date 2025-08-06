import { CommonModule } from '@angular/common';
import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';
import { Dialog } from '../../services/dialog';

@Component({
  selector: 'app-car-specs',
  imports: [MatIconModule, MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './car-specs.html',
  styleUrl: './car-specs.css',
})
export class CarSpecs {
  spec: WritableSignal<any> = signal({});

  // Row 1: Car info
  carInfoColumns = ['year', 'make', 'model', 'trim', 'color', 'mileage', 'vin'];

  constructor(
    private route: ActivatedRoute,
    private apiService: Api,
    private dialogService: Dialog
  ) {
    // Load initially
    this.loadSpec();

    // Reactively reload when apiService.updateSpecs changes to true
    effect(() => {
      if (this.apiService.updateSpecs()) {
        this.apiService.updateSpecs.set(false);
        this.loadSpec();
      }
    });
  }

  async loadSpec() {
    const selectedCar = this.apiService.selectedCar();
    if (selectedCar) {
      const specData = await this.apiService.getCarSpec(selectedCar.id);
      this.spec.set(specData);
    }
  }

  editSpec() {
    this.apiService.selectedSpec.set(this.spec());
    this.dialogService.changeView('editSpec');
    this.dialogService.open();
  }
}
