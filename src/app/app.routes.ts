import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CustomerComponent } from './pages/customer/customer.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'manage/customer',
    component: CustomerComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
