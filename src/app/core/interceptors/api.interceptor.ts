import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import {  finalize, Observable } from "rxjs";
import { LoadingService } from "../services/loading.service";
import { inject } from "@angular/core";

export function apiInterceptor (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>>{

    let activeRequest = 0; 
    let loadingService = inject(LoadingService);
    let  stopLoader = () => {
        activeRequest--;
        if(activeRequest === 0){
           loadingService.loadingOff();
        }
        if(loadingService.errorInRefresh.getValue()) {
            activeRequest = 0
        }       
    }
    
    if(loadingService.errorInRefresh.getValue()) loadingService.errorInRefresh.next(false)

    if(activeRequest === 0){ loadingService.loadingOn(); } 
        activeRequest++;
    
    return next(request).pipe(
        finalize(()=> stopLoader())
    );
}