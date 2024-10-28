import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DecodedToken, UserData } from '../intefaces/Auth';
import { environment } from '../../../environments/environment';

const AUTH_TOKEN_KEY = 'AuthToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';
const USER_DATA = 'UD';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  env = environment;
  http = inject(HttpClient);
  router = inject(Router);

  isLogged():boolean{
    return this.getAuthToken() != null;
  }

  setAuthToken(value:string){
    sessionStorage.setItem(AUTH_TOKEN_KEY,value);
  }

  getAuthToken():string | null{
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  setRefreshToken(value:string){
    sessionStorage.setItem(REFRESH_TOKEN_KEY,value);
  }

  getRefreshToken():string | null{
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setUserData(value:any){
    sessionStorage.setItem(USER_DATA,btoa(JSON.stringify(value)));
  }

  getUserData():UserData | null{
    return sessionStorage.getItem(USER_DATA) ? JSON.parse(atob(sessionStorage.getItem(USER_DATA)!)) : null;
  }

  getAuthTokenDecoded():DecodedToken | null{
    if(this.getAuthToken())
      return JSON.parse(atob(this.getAuthToken()?.split('.')[1]!)) as DecodedToken;
    else return null
  }

  getPermsForUser():string | undefined{
    return this.getAuthTokenDecoded()?.perm;
  }

  hasPermission(permission:string):boolean{
    let permissions = this.getPermsForUser()?.split(',');
    return permissions?.some(x=> x === permission)!;
  }

  clear(){
    sessionStorage.clear();
  }

  logout(){
    this.clear();
    this.router.navigate(['']);
  }
}