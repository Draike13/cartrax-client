import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { Car } from '../models/car';
import { Dialog } from '../services/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car-list',
  imports: [MatIconModule, MatTableModule, MatButtonModule],
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
  changeView(view: 'addCar' | 'editCar' | 'addItem' | 'addCustomer') {
    this.dialogSevice.changeView(view);
  }
  editCar(selectedCar: Car) {
    this.dialogSevice.selectedCar.set(selectedCar);
    this.changeView('editCar');
  }
}
