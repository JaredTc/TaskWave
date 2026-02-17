import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth-service/authentication.service';
import { BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/register/account') ||
    req.url.includes('/api/users/register') ||
    req.url.includes('/auth/refresh')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return auth.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false;
              localStorage.setItem('token', res.token);
              refreshTokenSubject.next(res.token);

              return next(
                authReq.clone({
                  setHeaders: { Authorization: `Bearer ${res.token}` },
                }),
              );
            }),
            catchError(() => {
              isRefreshing = false;
              router.navigate(['/auth/login']);
              return EMPTY;
            }),
          );
        }

        return auth.refreshToken().pipe(
          switchMap((res) => {
            isRefreshing = false;
            localStorage.setItem('token', res.token);
            refreshTokenSubject.next(res.token);

            return next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${res.token}` },
              }),
            );
          }),
          catchError(() => {
            isRefreshing = false;
            router.navigate(['/auth/login']);
            return EMPTY;
          }),
        );
      }

      return throwError(() => err);
    }),
  );
};
