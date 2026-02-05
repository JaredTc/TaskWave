import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {TokenService} from '../services/auth-service/token.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.tokenService.isLogged()
      ? true
      : this.router.createUrlTree(['/auth/login']);
  }


}
