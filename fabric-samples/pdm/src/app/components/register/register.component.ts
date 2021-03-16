/* Created By Faraz Shamim
Last Modification date : 31.01.2021
*/ 
import { SelectorListContext } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLogin: boolean = false;
  isAdmin : boolean = false;
  errorMessage;
  roles = ["Doctor","Patient"];
  _url ;
  username;
  

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this.isUserLogin() ;
    this.isAdmin = this._auth.isUserAdmin();
    this.username = this._auth.getUserDetails("username")
  }

  onSubmit(form: NgForm) {
    
    console.log('Your form data : ', form.value );
    this._url = form.value.role;
    let payload = { username : this.username,
                    role : form.value.role,
                    id: form.value.id,
                    doctorId : form.value.doctorId,
                    org : form.value.org,
                    address : form.value.address,
                    tel : form.value.tel,
                    patientId : form.value.patientId,
                    medication : form.value.medication,
                    diagnosis : form.value.diagnosis
                  }
      console.log ( payload);
    this._api.postTypeRequest(`register${this._url}`, payload).subscribe((res: any) => {
      if (res) {
        console.log(JSON.stringify(res));
        alert(JSON.stringify(res));
      window.location.reload();
      } 
      else {
        console.log(res);
        alert(res)}
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



    


    }
    // selectRole(form: NgForm ){
    //   const val  = form.value;
    //   if (val.role =="patient"){
    //     this._url = "registerPatient"
    //   } 
    //   else if (val.role =="doctor"){
    //     this._url = "registerDoctor"
    //   }
    
    // }
  
 


