import { Routes } from '@angular/router';
import {NoAuthGuard} from '../../core/guards/no-auth.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./authenticate')
        .then(m => m.Authenticate),
  }
];
