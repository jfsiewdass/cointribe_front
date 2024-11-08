import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { GenericResponse } from '../intefaces/GenericResponse';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  env = environment;
  private httpClient = inject(HttpClient)

  getTransactions(page: number = 1, limit: number = 10):Observable<any>{
    let params = new HttpParams({ 
      fromObject: { 'page': page, 'limit': limit } 
    });

    return this.httpClient.get<GenericResponse<any>>(`${this.env.apiUrl}${'transaction/all'}`, {params :params})
    .pipe(
      switchMap(response =>
        response.statusCode === 200
          ? of(response.data)
          : throwError(() => response)
      )
    );
  }
  transfer(body: any): Observable<any> {
    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}${'wallet/transfer'}`, body)
    .pipe(
      switchMap(response =>
        response.statusCode === 200
          ? of(response.data)
          : throwError(() => new Error(response.message))
      )
    );
  }
}