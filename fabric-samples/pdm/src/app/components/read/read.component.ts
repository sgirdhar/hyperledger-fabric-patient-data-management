import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../user';
import {MatSelectModule} from '@angular/material/select';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  patient : User[];
  isValidUser;
  isDoctor : boolean;
  isPatient : boolean;
  roleDoctor = "doctor";
  role;
  username;
  patientId;
  id;
  returnsData : boolean = false;

  constructor(private _auth : AuthService,
              private _route : RouterModule,
              private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
    this.isPatient = this._auth.isUserPatient();
    if(this.isPatient) {
      this.username = this._auth.getUserDetails("username");
      this.patientId = this._auth.getUserDetails("username");
      this.role = 'patient';
      this.id = this._auth.getUserDetails("username");
      this.returnsData = false;
    }

    this.isValidUser = function(){
      if (this._auth.isDoctor || this._auth.isPatient){
        return true;
      }
      else {
        return false;
      }
    }

    // this.readByPatient();

  }
  // for doctor to read Patient Data
  readByDoctor(form : NgForm){
    console.log(form.value);
    
    this.role = ""
    this._api.postTypeRequest("readPatientData",form.value).subscribe((res : any)=>{
      this.patient = Array.of(res);
      console.log(res);
      this.returnsData = true;
    });

  }

  // for patient to read His/Her Data
  readByPatient(form : NgForm){
    if(this.isPatient){
      console.log(this._auth.getUserDetails("username"));
      console.log(this._auth.getToken());
      let payload = { username: this._auth.getUserDetails("username"), 
                      patientId: this._auth.getUserDetails("username"), 
                      role: 'patient', 
                      id:this._auth.getUserDetails("username"), 
                      org: form.value.org}
      this._api.postTypeRequest("readPatientData",payload).subscribe((res : any)=>{
      this.patient = Array.of(res);
      this.returnsData = true;
      });
    }
  }

}
