import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { taskWaveEndpoints } from '../task-wave-endpoints';
import { HttpClient } from '@angular/common/http';
import { UserRegister } from '../../models/auth.model';
import { ApiResponse } from '../../models/genearl.models';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
   apiUri: string = environment.env_url;

   constructor(
    private http: HttpClient
   ) { }


   postAccountRegistration(payload: UserRegister): Observable<ApiResponse> {
    const url = this.apiUri + taskWaveEndpoints.register;
    return this.http.post<ApiResponse>(url, payload).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message || 'An error occurred during registration'))
      }
    ));
   }
}
