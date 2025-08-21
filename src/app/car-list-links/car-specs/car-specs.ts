import { CommonModule } from '@angular/common';
import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';
import { Dialog } from '../../services/dialog';
import { PartsLookup } from '../../services/parts-lookup';

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
    private dialogService: Dialog,
    private partsLookup: PartsLookup
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

  // simple pass-through for template usage
  labelFor = (fieldOrLabel: string, id: number | string | null | undefined) =>
    this.partsLookup.labelFor(fieldOrLabel, id);

  async loadSpec() {
    const selectedCar = this.apiService.selectedCar();
    if (!selectedCar) return;

    const specData = await this.apiService.getCarSpec(selectedCar.id);
    const specObj = specData?.spec ?? specData?.spec ?? specData;

    // preload only the needed parts lists before rendering
    await this.partsLookup.ensureForSpec(specObj);

    this.spec.set(specData);
  }

  editSpec() {
    this.apiService.selectedSpec.set(this.spec());
    this.dialogService.changeView('editSpec');
    this.dialogService.open();
  }
  clearSpec() {
    this.apiService.selectedSpec.set(this.spec());
    this.dialogService.open();
    this.dialogService.changeView('clearSpec');
  }
}
