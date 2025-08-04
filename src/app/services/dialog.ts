import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputDialog } from '../input-dialog/input-dialog';
import { Car } from '../models/car';
import { Api } from './api';
import { CarViewType } from '../models/car-view-type';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  selectedCar: WritableSignal<Car | null> = signal(null);
  viewType: WritableSignal<CarViewType | null> = signal(null);
  searchActive: WritableSignal<boolean> = signal(false);

  constructor(private dialog: MatDialog, private apiService: Api) {}

  open() {
    this.dialog.open(InputDialog, {
      width: '80vw',
      maxWidth: '900px',
      minHeight: '40vh',
    });
  }

  changeView(view: CarViewType) {
    this.viewType.set(view);
  }
}
