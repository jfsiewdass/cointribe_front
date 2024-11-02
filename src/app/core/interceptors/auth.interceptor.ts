import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

import { TokenService } from '../services/token.service';
import { LoadingService } from '../services/loading.service';
import { SnackbarService } from '../services/snackbar.service';

const TOKEN_HEADER_KEY = 'Authorization';

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  let isRefreshing = false;
  let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  let authService = inject(AuthService);
  let tokenService = inject(TokenService);
  let toastr = inject(SnackbarService);
  let loadingService = inject(LoadingService);

  const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      if (tokenService.isLogged()) {
        return authService.refreshToken({ Token: tokenService.getAuthToken()!, RefreshToken: tokenService.getRefreshToken()! }).pipe(
          switchMap((resp) => {
            isRefreshing = false;
            tokenService.setAuthToken(resp.Token);
            tokenService.setRefreshToken(resp.RefreshToken)
            refreshTokenSubject.next(resp.Token);
            return next(addTokenHeader(request, resp.Token));
          }),
          catchError((error) => {
            authService.exitSystem();
            isRefreshing = false;

            loadingService.loadingOff();
            loadingService.errorInRefresh.next(true);
            if ((error instanceof HttpErrorResponse)) toastr.error(`Ocurrio un error refrescando la sesión. ${error}`);
            return throwError(() => 'Su sesión fue expirada.');
          })
        );
      }
    }

    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token)))
    );
  }

  const addTokenHeader = (request: HttpRequest<any>, token: string) => {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }

  if (tokenService.getAuthToken()) request = addTokenHeader(request, tokenService.getAuthToken()!);

  return next(request).pipe(
    catchError((error) => {
      let message = 'Ocurrio un error intente más tarde'

      if (error instanceof HttpErrorResponse && !request.url.includes('/Auth') && error.status === 401)
        return handle401Error(request, next);
      if (error instanceof HttpErrorResponse && error.status === 404)
        message = 'No se encontro el recurso solicitado';
      if (error instanceof HttpErrorResponse && error.status === 500)
        message = 'Ha ocurrido un error interno, por favor intente más tarde';

      return throwError(() => message);
    })
  );
}