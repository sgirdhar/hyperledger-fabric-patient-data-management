import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/services/api.service';
import { AuthService } from '../services/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogin: boolean;
  errorMessage

  
  constructor( 
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router,
   
    ) {}
      
     

  ngOnInit(): void {
    this.isUserLogin();
    
   
  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
      this._api.postTypeRequest('login', form.value).subscribe((res: any) => {

      if (res) {
        console.log(res)
        this._auth.setDataInLocalStorage('userData', res.rol);
        this._auth.setDataInLocalStorage('token', res.accessToken);
        this._router.navigateByUrl(res.rol);
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
    this._router.navigate(['']);
  }

}
