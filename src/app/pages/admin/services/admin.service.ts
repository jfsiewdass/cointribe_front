import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of, switchMap, throwError } from "rxjs";
import { GenericResponse } from "../../../core/intefaces/GenericResponse";
import { UserFilterQuery } from "../interfaces/admin";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    env = environment;
    private httpClient = inject(HttpClient)
    private router = inject(Router)

    getUsers(query: UserFilterQuery): Observable<any> {

        let params = new HttpParams({
			fromObject: { 'page': query?.page, 'limit': query?.limit }
		});
        if (query?.firstName!) params = params.append('firstName', query?.firstName!);
        if (query?.lastName!) params = params.append('lastName', query?.lastName!);
        if (query?.email!) params = params.append('email', query?.email!);
        if (query?.status!) params = params.append('status', query?.status!);
        if (query?.wallet!) params = params.append('wallet', query?.wallet!);

        return this.httpClient.get<GenericResponse<any>>(`${this.env.apiUrl}${'user/all'}`, { params: params })
            .pipe(
                switchMap(response =>
                    response.statusCode == 200
                        ? of(response.data)
                        : throwError(() => response)
                )
            );
    }
}