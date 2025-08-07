import {
  Component,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { Car } from '../models/car';
import { Dialog } from '../services/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ViewType } from '../models/view-type';

@Component({
  selector: 'app-car-list',
  imports: [MatIconModule, MatTableModule, MatButtonModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList {
  readonly cars: Signal<Car[]>;
  sortColumn: WritableSignal<keyof Car> = signal('vin');
  sortDirection: WritableSignal<'asc' | 'desc'> = signal('asc');

  displayedColumns = [
    'records',
    'vin',
    'year',
    'make',
    'model',
    'mileage',
    'actions',
  ];

  constructor(
    private router: Router,
    private apiService: Api,
    private dialogSevice: Dialog
  ) {
    if (!this.apiService.lockedCarsList()) {
      this.apiService.updateSignal.set(true);
    }
    this.cars = this.apiService.cars;
  }
  sortedCars() {
    return [...this.cars()].sort((a, b) => {
      const col = this.sortColumn();
      const dir = this.sortDirection() === 'asc' ? 1 : -1;

      const valA = a[col] ?? '';
      const valB = b[col] ?? '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir;
      } else {
        return String(valA).localeCompare(String(valB)) * dir;
      }
    });
  }

  sortBy(column: keyof Car) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  goToMainPage() {
    this.router.navigate(['']);
  }

  openDialog() {
    this.dialogSevice.open();
  }
  editCar(selectedCar: Car) {
    this.dialogSevice.selectedCar.set(selectedCar);
    this.changeView('editCar');
  }
  deleteCar(car: Car) {
    this.dialogSevice.selectedCar.set(car);
    this.dialogSevice.delete();
  }
  changeView(view: ViewType) {
    this.dialogSevice.changeView(view);
  }

  searchActive() {
    return this.dialogSevice.searchActive();
  }
  clearSearch() {
    this.dialogSevice.searchActive.set(false);
    this.dialogSevice.viewType.set(null);
    this.apiService.updateSignal.set(true);
  }

  goToServiceRecords(carId: number) {
    this.router.navigate(['/carList', carId, 'service-records']);
  }

  goToSpecs(carId: number) {
    this.router.navigate(['/carList', carId, 'specs']);
  }
  setSelectedCar(car: Car) {
    this.apiService.selectedCar.set(car);
    this.apiService.selectedCarId.set(car.id);
  }

  unlockCarList() {
    this.apiService.lockedCarsList.set(false);
    this.apiService.updateSignal.set(true);
  }
}
