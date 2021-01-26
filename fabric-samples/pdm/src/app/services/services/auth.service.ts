import { User } from './../../user';
import * as moment from "moment";

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {observable,pipe} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import {tap} from 'rxjs/operators'


@Injectable(
  {providedIn: 'root'}
  )
export class AuthService {
  
  constructor(private http : HttpClient) { }
  
  // getUserDetails() {
  //   return localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
  // }
    
    login(username: string, password: string){
      
      return this.http.post<any>(`http://localhost:5001/login`,{username,password}).pipe(
        tap(res => this.setSession),   
        shareReplay()    
          )
          
      }

      private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn,'second');

        localStorage.setItem('id_token', authResult.accessToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    

   
    
  // setDataInLocalStorage(variableName, data) {
  //   localStorage.setItem(variableName, data);
  // }
  
  // getToken() {
  //   return localStorage.getItem('token');
  // }
  // clearStorage() {
  //   localStorage.clear();
  // }
}