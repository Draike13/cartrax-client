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
  carInfoColumns = [
    'year',
    'make',
    'model',
    'trim',
    'color',
    'mileage',
    'vin',
    'notes',
  ];

  // Row 2: First half of car_specs
  firstSpecColumns = [
    'engine_oil_viscosity',
    'engine_oil_quantity',
    'engine_oil_filter',
    'brake_fluid_type',
    'brake_pad',
    'brake_rotor',
    'tire_size',
    'tire_brand',
    'transmission_fluid_type',
    'transmission_fluid_quantity',
    'coolant_type',
  ];

  // Row 3: Second half of car_specs
  secondSpecColumns = [
    'engine_air_filter',
    'cabin_air_filter',
    'wiper_blade_size',
    'headlight',
    'taillight',
    'turn_signal_light',
    'license_plate_light',
    'battery',
    'serpentine_belt',
    'thermostat',
  ];

  constructor(private route: ActivatedRoute, private apiService: Api) {}

  async ngOnInit() {
    const selectedCar = this.apiService.selectedCar();
    if (selectedCar) {
      const specData = await this.apiService.getCarSpec(selectedCar.id);
      this.spec.set(specData);
    }
  }
}
