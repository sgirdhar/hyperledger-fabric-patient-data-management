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
  isLogin: boolean = false;
  errorMessage
  form: FormGroup;
  
  constructor( 
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router,
    private fb: FormBuilder) {
      
      this.form = this.fb.group({
        username: ['', Validators.required],
        password : ['', Validators.required]
      });
     }

  ngOnInit(): void {
    //this.isUserLogin();
    // this._auth.clearStorage()
    this._auth.logout();
  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
    // let username = (document.getElementById("username") as  HTMLInputElement).value;
    // let password = (document.getElementById("password") as HTMLInputElement).value
    // console.log(this._auth.login(username,password));
    const val = this.form.value;
    if (val.username && val.password){
      this._auth.login(val.email,val.password)
        .subscribe(
          ()=> {
            console.log ("User is logged in");
            this._router.navigateByUrl('/');
          }
        )
    }
    


    
    // this._api.postTypeRequest('login', form.value).subscribe((res: any) => {
    //   if (res) {
    //     console.log(res)
    //     //this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
    //     //this._auth.setDataInLocalStorage('token', res.accessToken);
    //     this._router.navigate(['']);
    //   } 
    //   else {}
    // }, 
    // err => {
    //   this.errorMessage = err['error'].message;
    // });
  }
  // isUserLogin(){console.log(this._auth.getToken())
  //   if(this._auth.getToken() != null){
  //     this.isLogin = true;
  //   }
  // }
  
  // logout(){
  //   this._auth.clearStorage();
  //   this._router.navigate(['']);
  // }

}
