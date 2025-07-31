import { Routes } from '@angular/router';
import { CarList } from './car-list/car-list';
import { MainPage } from './main-page/main-page';

export const routes: Routes = [
  { path: '', component: MainPage }, // Default route
  { path: 'carList', component: CarList },
];
