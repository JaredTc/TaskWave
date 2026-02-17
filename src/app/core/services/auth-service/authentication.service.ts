import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { taskWaveEndpoints } from '../task-wave-endpoints';
import { BehaviorSubject, map, tap, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthResponse, PayloadAuth, User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  apiUri: string = environment.env_url;
  isRefreshing = false;
  private currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public currentToken$ = this.currentTokenSubject.asObservable();

  // estado global
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

autheticate(payload: PayloadAuth) {
  const url = this.apiUri + taskWaveEndpoints.auth;

  return this.http.post<AuthResponse>(url, payload).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);
      this.currentTokenSubject.next(res.token);
    }),
    switchMap(() => this.postMe()),
    tap(() => this.router.navigate(['/dashboard'])),
    catchError((error: HttpErrorResponse) => {
      const msg =
        typeof error.error === 'string'
          ? error.error
          : error.error?.error || error.message || 'Unknown error';

      return throwError(() => new Error(msg));
    })
  );
}



  initUserFromStorage() {
  const token = localStorage.getItem('token');
  if (!token) return;
    this.currentTokenSubject.next(token);

  this.postMe().subscribe({
    error: () => this.logOut()
  });
}

  postMe(): Observable<User> {
    const url = this.apiUri + taskWaveEndpoints.me;
    return this.http.get<User>(url).pipe(
      tap((user) => {
        this.setUser(user);
      }),
    );

  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  hasRole(role: 'ADMIN' | 'USER'): boolean {
    return this.userSubject.value?.roles.includes(role) ?? false;
  }


  refreshToken() {
    // if (this.isRefreshing) return this.currentToken$;
    const url = this.apiUri + taskWaveEndpoints.refresh_token;
    return this.http.post<{ token: string }>(url, {}, { withCredentials: true }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      }),
    );
  }

  logOut() {
    const url = this.apiUri + taskWaveEndpoints.logOut;
    return this.http
      .post(
        url,
        {},
        {
          withCredentials: true,
          responseType: 'text',
        },
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          location.reload();
        }),
      );
  }
}
