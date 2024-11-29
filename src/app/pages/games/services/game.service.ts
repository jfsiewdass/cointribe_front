import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { GenericResponse } from '../../../core/intefaces/GenericResponse';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  env = environment;

  private httpClient = inject(HttpClient)

  diceBet(bet:string):Observable<any>{
    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}${'games/dice/bet'}`, { bet: bet })
    .pipe(
      switchMap(response =>
        response.statusCode == 201
          ? of(response.data)
          : throwError(() => response)
      )
    );
  }
}