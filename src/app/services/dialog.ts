import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputDialog } from '../input-dialog/input-dialog';
import { Car } from '../models/car';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  selectedCar: WritableSignal<Car | null> = signal(null);
  viewType: WritableSignal<
    'addCar' | 'editCar' | 'addItem' | 'addCustomer' | null
  > = signal(null);

  constructor(private dialog: MatDialog, private apiService: Api) {}

  open() {
    this.dialog.open(InputDialog, {
      width: '80vw',
      maxWidth: '900px',
    });
  }

  changeView(view: 'addCar' | 'editCar' | 'addItem' | 'addCustomer') {
    this.viewType.set(view);
  }
}
