
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
    public isAdmin : boolean = false;
    public isDoctor : boolean = false;
    public isPatient : boolean = false;
  
  constructor(private http : HttpClient) { }
  
  getUserDetails(variableName) {
  return localStorage.getItem(variableName);
  }
    
  setDataInLocalStorage(variableName : string, data : string) {
    localStorage.setItem(variableName, data);
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  clearStorage() {
    localStorage.clear();
  }

  isUserAdmin(){
    if (this.getUserDetails("userData")=="admin"){
      return true;
    }
    else {
     return false;
    }
  }

  isUserDoctor(){
    if(this.getUserDetails("userData")=="doctor"){
      return true;
    }
    else {
      return false;
    }
  }

  isUserPatient(){
    if(this.getUserDetails("userData")=="patient"){
      return true;
    }
    else {
      return false;
    }
  }


}