import { Routes } from '@angular/router';
import { CarList } from './car-list/car-list';
import { MainPage } from './main-page/main-page';
import { CarSpecs } from './car-list-links/car-specs/car-specs';
import { ServiceRecords } from './car-list-links/service-records/service-records';
import { PartsTable } from './parts-table/parts-table';
import { Login } from './login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainPage },
  {
    path: 'carList',
    children: [
      { path: '', canActivate: [authGuard], component: CarList },
      { path: ':id/specs', canActivate: [authGuard], component: CarSpecs },
      {
        path: ':id/service-records',
        canActivate: [authGuard],
        component: ServiceRecords,
      },
    ],
  },
  { path: 'partsTable', canActivate: [authGuard], component: PartsTable },

  { path: 'login', component: Login },
];
