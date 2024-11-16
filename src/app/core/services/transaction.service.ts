import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of, switchMap, throwError } from 'rxjs';
import { GenericResponse } from '../intefaces/GenericResponse';
import { Transaction } from '../intefaces/Transaction';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();
  env = environment;
  private httpClient = inject(HttpClient)
  private currentPage = 1;
  private pageSize = 10;

  constructor() {
    // Cargar los primeros 10 registros al iniciar el servicio
    this.loadTransactions();
  }

  loadTransactions(page = this.currentPage) {
    this.getTransactions(page).subscribe({
      next: (newTransactions: Array<Transaction>) => {
        this.transactionsSubject.next([...this.transactionsSubject.value, ...newTransactions]);
      }
    });
  }

  getTransactions(page: number, limit: number = 10):Observable<any>{
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