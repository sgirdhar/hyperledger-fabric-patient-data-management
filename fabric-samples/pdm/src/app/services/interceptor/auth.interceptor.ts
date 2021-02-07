import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public auth : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>{
    const idToken =localStorage.getItem("token");

    if (idToken){
      const cloned = request.clone({
        headers: request.headers.set("Authorization",
        "Bearer "+idToken)
      });
      return next.handle(cloned);
    }
    else{
    return next.handle(request);
  }
  }
}
