import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputDialog } from '../input-dialog/input-dialog';
import { Car } from '../models/car';
import { Api } from './api';
import { ViewType } from '../models/view-type';
import { DeleteDialog } from '../delete-dialog/delete-dialog';
import { Part } from '../models/part-type';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  selectedCar: WritableSignal<Car | null> = signal(null);
  viewType: WritableSignal<ViewType | null> = signal(null);
  searchActive: WritableSignal<boolean> = signal(false);
  selectedPart: WritableSignal<Part | null> = signal(null);

  constructor(private dialog: MatDialog, private apiService: Api) {}

  open() {
    this.dialog.open(InputDialog, {
      width: '80vw',
      maxWidth: '900px',
      minHeight: '40vh',
      autoFocus: false,
    });
  }

  delete() {
    this.dialog.open(DeleteDialog, {
      width: '80vw',
      maxWidth: '600px',
      minHeight: '40vh',
    });
  }

  changeView(view: ViewType) {
    this.viewType.set(view);
  }
}
