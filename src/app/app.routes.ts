import { Routes } from '@angular/router';
import {MainContent} from './layout/main-content/main-content';
import {AuthGuard} from './core/guards/auth-guard.guard';
import {RoleGuard} from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/authenticate/authentication.routes')
        .then(m => m.AuthenticationRoutes),
  },
   {
        path: 'register',
        loadChildren: () =>
          import('./features/register-account-component/register-account.routes')
            .then(m => m.RegisterAccountRoutes),
      },

  {
    path: '',
    component: MainContent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        loadChildren: () =>
          import('./features/home-component/home.routes')
            .then(m => m.HomeRoutes),
      },

    ]
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
