import { AuthModule } from '../../auth/auth.module';
/* Created By Faraz Shamim
Last Modification date : 31.01.2021
*/ 
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';
import { stringify } from '@angular/compiler/src/util';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean;
  errorMessage;
  role;
  username;
  roleLoggedIn;
  
  constructor( 
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router,
    private _route: ActivatedRoute
   
    ) {}
      
     

  ngOnInit(): void {
    this.isUserLogin();
    this.roleLoggedIn = this._auth.getUserDetails("userData");
   
  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
      
      this._api.postTypeRequest('login', form.value).subscribe((res: any) => {

      if (res) {
        console.log(res);
        this.role = res.rol;
        this._auth.setDataInLocalStorage('username',form.value.username);
        this._auth.setDataInLocalStorage('userData', this.role);
        this._auth.setDataInLocalStorage('token', res.accessToken);
        this._router.navigateByUrl(this.role);
      } 
      else {}
    }, 
    err => {
      this.errorMessage = err['error'].message;
    });
  }

  isUserLogin(){
    if(this._auth.getToken()!= null){
      this.isLogin = true;
    }

  
  }

  getUserName(){
    return this.username;
  }
 
  
  logout(){
    this._auth.clearStorage();
    window.location.reload();

    }
  
  redirect(){
    console.log(JSON.stringify(this.role));
    this._router.navigate(this.role);
  }

}
