import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  patient : User[];
  returnsData : boolean = false;
  errorMessage : String;
  username : String;
  patientId : String;
  role : String;
  id : String;
  org : String;
  add : String;
  tel : number;
  
  isPatient : boolean = false;
  constructor(private _auth : AuthService,
    private _api : ApiService) { }

  ngOnInit(): void {
    this.isPatient = this._auth.isUserPatient();
    this.org = "Hospital1";
    this.username = this._auth.getUserDetails("username");
    this.patientId = this._auth.getUserDetails("username");
    this.role = this._auth.getUserDetails("userData");
    this.id = this._auth.getUserDetails("username");

    this.readByPatient()
  }

  // for patient to read His/Her Data
  readByPatient(){
    let payload = { username: this.username,
      patientId: this.patientId,
      role: this.role,
      id: this.id,
      org: this.org }

    this._api.postTypeRequest("readPatientData",payload).subscribe((res : any)=>{
    this.add = res.Address;
    this.tel = res.Telephone;
    });
  }

  UpdatePersonalInfo(form : NgForm){
    
    let payload = { username : this.username,
                    patientId : this.patientId,
                    role : this.role,
                    id : this.id,
                    org : this.org,
                    address : form.value.address,
                    tel : form.value.telephone
                  }
    console.log(payload);
    
    this._api.postTypeRequest("updatePatientInfo",payload).subscribe((res : any)=>{
      if (res){
      this.patient = Array.of(res);
      console.log(res);
      this.returnsData = true;
      }
      else {
        console.log(res);
        alert(res);
        window.location.reload();
      }
    },
    err => {
      this.errorMessage = err['error'].message;
    });
  }

}
