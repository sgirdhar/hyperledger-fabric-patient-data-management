
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
  
  getUserDetails() {
  return localStorage.getItem('userData');
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
}