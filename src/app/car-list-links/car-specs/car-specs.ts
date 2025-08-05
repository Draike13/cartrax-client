import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';

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

  constructor(private route: ActivatedRoute, private apiService: Api) {}

  async ngOnInit() {
    const selectedCar = this.apiService.selectedCar();
    if (selectedCar) {
      const specData = await this.apiService.getCarSpec(selectedCar.id);
      this.spec.set(specData);
    }
  }
}
