import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {taskWaveEndpoints} from '../task-wave-endpoints';
import {BehaviorSubject, map, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {AuthResponse, PayloadAuth} from '../../models/auth.model';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  apiUri: string = environment.env_url;
  isRefreshing = false;
  private currentTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public currentToken$ = this.currentTokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  autheticate(payload:
              PayloadAuth) {
    const url = this.apiUri + taskWaveEndpoints.auth
    return this.http.post<AuthResponse>(
      url,
      payload
    ).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 5000);

        }
      }),
      catchError((error: HttpErrorResponse) => {
        let msg = 'Unknown error';

        if (typeof error.error === 'string') {
          msg = error.error;
        } else if (error.error?.error) {
          msg = error.error.error; // 👈 AQUÍ está tu mensaje
        } else if (error.message) {
          msg = error.message;
        }

        return throwError(() => new Error(msg));
      })
    );
  }

  refreshToken() {
    // if (this.isRefreshing) return this.currentToken$;
    const url = this.apiUri + taskWaveEndpoints.refresh_token
    return this.http.post<{ token: string }>(
      url,
      {},
      {withCredentials: true}
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logOut() {
    const url = this.apiUri + taskWaveEndpoints.logOut;
    return this.http.post(
      url,
      {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    ).pipe(
      tap(() => {
        localStorage.removeItem('token');
        location.reload();
      })
    );
  }


}
