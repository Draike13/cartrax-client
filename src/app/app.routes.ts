import { Routes } from '@angular/router';
import { CarList } from './car-list/car-list';
import { MainPage } from './main-page/main-page';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainPage },

  { path: 'carList', component: CarList },
];
