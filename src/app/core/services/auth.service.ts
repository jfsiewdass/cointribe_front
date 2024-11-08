import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { LoginRequest, LogoutData, RefreshTokenBody, RefreshTokenData, UserData } from '../intefaces/Auth';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { GenericResponse } from '../intefaces/GenericResponse';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  env = environment;

  private httpClient = inject(HttpClient)
  private router = inject(Router)

  login(body:any):Observable<UserData>{
    return this.httpClient.post<GenericResponse<UserData>>(`${this.env.apiUrl}${'user/login'}`, body)
    .pipe(
      switchMap(response =>
        response.statusCode == 200
          ? of(response.data)
          : throwError(() => response)
      )
    );
  }

  logout():Observable<LogoutData>{
    return this.httpClient.delete<GenericResponse<LogoutData>>(`${this.env.apiUrl}user/logout`)
    .pipe(
      switchMap(response =>
        response.statusCode === 200
          ? of(response.data)
          : throwError(() => response.message)
      )
    );
  }

  refreshToken(refreshTokenBody:RefreshTokenBody):Observable<RefreshTokenData> {
    return this.httpClient.put<GenericResponse<RefreshTokenData>>(`${this.env.apiUrl}${'api/central/sessions'}`,refreshTokenBody)
    .pipe(
      switchMap(response =>
        response.statusCode === 200
          ? of(response.data)
          : throwError(() => response.message)
      )
    );
  }

  exitSystem(){
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
