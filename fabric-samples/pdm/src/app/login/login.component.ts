import { AuthModule } from './../auth/auth/auth.module';
/* Created By Faraz Shamim
Last Modification date : 31.01.2021
*/ 
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/services/api.service';
import { AuthService } from '../services/services/auth.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean;
  errorMessage;
  role;

  
  constructor( 
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router,
    private _route: ActivatedRoute
   
    ) {
      this
    }
      
     

  ngOnInit(): void {
    this.isUserLogin();
    
   
  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
      this._api.postTypeRequest('login', form.value).subscribe((res: any) => {

      if (res) {
        console.log(res)
        this.role = res.rol;
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

 
  
  logout(){
    this._auth.clearStorage();
    window.location.reload();

    }
  
  redirect(){
    console.log(JSON.stringify(this.role));
    this._router.navigate(this.role);
  }

}
