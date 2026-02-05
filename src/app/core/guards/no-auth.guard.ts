import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {TokenService} from '../services/auth-service/token.service';


@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.tokenService.isLogged() && !this.tokenService.isTokenExpired()) {
      this.router.navigate(['/dashboard']);
      return false
    }
    return true;
  }
}
