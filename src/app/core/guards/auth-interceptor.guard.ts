import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth-service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ignorar login y registro
    const publicUrls = ['api/auth/login', 'api/auth/register'];
    if (publicUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          if (!this.auth.isRefreshing) {
            this.auth.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.auth.refreshToken().pipe(
              switchMap(res => {
                this.auth.isRefreshing = false;
                localStorage.setItem('token', res.token);
                this.refreshTokenSubject.next(res.token);

                const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
                return next.handle(newReq);
              }),
              catchError(() => {
                this.auth.isRefreshing = false;
                this.router.navigate(['/auth/login']);
                return EMPTY;
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              switchMap(token => {
                if (token) {
                  const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                  return next.handle(newReq);
                }
                return EMPTY;
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
