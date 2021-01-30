import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/services/api.service';
import { AuthService } from '../services/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLogin: boolean = false;
  isAdmin : boolean = false;
  errorMessage
  roles = ["doctor","patient"]
  

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.isUserLogin() ;
    this.isUserAdmin();
  }

  onSubmit(form: NgForm) {
    
    console.log('Your form data : ', form.value, );
    this._api.postTypeRequest('registerPatient', form.value).subscribe((res: any) => {
      if (res.status) {console.log(res);
        //this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
       // this._auth.setDataInLocalStorage('token', res.getToken());this._router.navigate(['login']);
      } 
      else {
        console.log(res);
        alert(res.msg)}
    },
    
    err => {
      this.errorMessage = err['error'].message;
    });
  }
  isUserLogin(){
    if(this._auth.getToken() != null){
      this.isLogin = true;
    }
    else{
      this.isLogin = false;
    }
  }

  isUserAdmin(){
    if (this._auth.getUserDetails()=="admin"){
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
    }
  }


}
