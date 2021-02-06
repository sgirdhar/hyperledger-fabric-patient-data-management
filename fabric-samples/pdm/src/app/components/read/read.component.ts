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
  isDoctor;
  isPatient;
  role = ["doctor"];
  username;

  constructor(private _auth : AuthService,
              private _route : RouterModule,
              private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
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
    console.log(form.value);
    console.log("i am in updatedHealthRecord");

    this._api.postTypeRequest("readPatientData",form.value).subscribe((res : any)=>{
      this.patient = Array.of(res);
      console.log(res);
    });

  }

  //for patient to read His/Her Data
  readByPatient(){
    if(this.isPatient){
      console.log(this._auth.getUserDetails("username"));
      this._api.postTypeRequest("readPatientData",this._auth.getUserDetails("username")).subscribe((res : any)=>{
        this.patient = Array.of(res);
        console.log(res);
      });
    }

  }
}
