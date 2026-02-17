import { Routes } from "@angular/router";


export const RegisterAccountRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'account'
  },
  {
    path: 'account',
    loadComponent: () => import('./register-account-component').then(m => m.RegisterAccountComponent)
  }
]
