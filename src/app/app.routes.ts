import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Form } from './form/form';
import { HomeComponent } from './home/home';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { UpdateUserComponent } from './update-user/update-user';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: Login},
  { path: 'create-user', component: Form },
  { path: 'dashboard', component: Dashboard },
  { path: 'update-user', component: UpdateUserComponent },
];


