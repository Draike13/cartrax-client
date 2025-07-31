import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { Car } from '../models/car';
import { Dialog } from '../services/dialog';

@Component({
  selector: 'app-car-list',
  imports: [],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList {
  readonly cars: Signal<Car[]>;

  constructor(
    private router: Router,
    private apiService: Api,
    private dialogSevice: Dialog
  ) {
    this.cars = this.apiService.getCars;
  }

  goToMainPage() {
    this.router.navigate(['']);
  }

  openDialog() {
    this.dialogSevice.open();
  }
  changeView(view: 'addCar' | 'addItem' | 'addCustomer') {
    this.dialogSevice.changeView(view);
  }
}
