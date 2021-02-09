import { DoctorComponent } from './../../view/doctor/doctor.component';
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
  role : string;
  username : String;
  patientId : String;
  id : String;
  org : String;
  errorMessage;

  constructor(private _auth : AuthService,
              private _route : RouterModule,
              private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
    this.isPatient = this._auth.isUserPatient();
    this.username = this._auth.getUserDetails("username");
    this.patientId = this._auth.getUserDetails("username");
    this.role = this._auth.getUserDetails("userData");
    this.id = this._auth.getUserDetails("username");

    if(this.isPatient) {
      this.org = "Hospital1";
    }

    this.isValidUser = function(){
      if (this._auth.isDoctor || this._auth.isPatient){
        return true;
      }
      else {
        return false;
      }
    }

     this.readByPatient();

  }
  // for doctor to read Patient Data
  readByDoctor(form : NgForm){
    
    let payload = { username: this.username,
                    role: this.role,
                    id: this.id,
                    doctorId: this.username,
                    patientId: form.value.patientId,
                    org: form.value.org }
    console.log(payload);
    
    this._api.postTypeRequest("readPatientData",payload).subscribe((res : any)=>{
      
      this.patient = Array.of(res);
      if(res==="Access Denied"){
        alert(res);
      }
      console.log(res);
    });
  }

  // for patient to read His/Her Data
  readByPatient(){
    if(this.isPatient){
      let payload = { username: this.username,
                      patientId: this.patientId,
                      role: this.role,
                      id: this.id,
                      org: this.org }
      this._api.postTypeRequest("readPatientData",payload).subscribe((res : any)=>{
        this.patient = Array.of(res);
      });
    }
  }

}
