import { Routes } from '@angular/router';
import { CarList } from './car-list/car-list';
import { MainPage } from './main-page/main-page';
import { CarSpecs } from './car-list-links/car-specs/car-specs';
import { ServiceRecords } from './car-list-links/service-records/service-records';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainPage },
  {
    path: 'carList',
    children: [
      { path: '', component: CarList },
      { path: ':id/specs', component: CarSpecs },
      { path: ':id/service-records', component: ServiceRecords },
    ],
  },
];
