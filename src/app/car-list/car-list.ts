import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { Car } from '../models/car';

@Component({
  selector: 'app-car-list',
  imports: [],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList {
  readonly cars: Signal<Car[]>;
  constructor(private router: Router, private apiService: Api) {
    this.cars = this.apiService.getCarsRequest;
  }

  goToMainPage() {
    this.router.navigate(['']);
  }
}
