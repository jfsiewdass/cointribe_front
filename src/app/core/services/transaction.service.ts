import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { GenericResponse } from '../intefaces/GenericResponse';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  env = environment;
  private httpClient = inject(HttpClient)

  getTransactions():Observable<any>{
    return this.httpClient.get<GenericResponse<any>>(`${this.env.apiUrl}${'transaction/all'}`)
    .pipe(
      switchMap(response =>
        response.statusCode === 200
          ? of(response.data)
          : throwError(() => new Error(response.message))
      )
    );
  }

}