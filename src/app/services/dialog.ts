import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputDialog } from '../input-dialog/input-dialog';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  viewType: WritableSignal<'addCar' | 'addItem' | 'addCustomer' | null> =
    signal(null);
  constructor(private dialog: MatDialog) {}

  open() {
    this.dialog.open(InputDialog, {
      width: '800px',
      height: '600px',
    });
  }

  changeView(view: 'addCar' | 'addItem' | 'addCustomer') {
    this.viewType.set(view);
  }
}
