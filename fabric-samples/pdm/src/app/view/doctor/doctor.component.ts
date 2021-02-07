import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/user';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  hide = true;
  isDoctor : boolean = false;
  patient : User;
  columnsToDisplay=["Patient Id","Doctor Authorization List",
                    "Diagnosis","Medication","Address","Telephone"]
  role = "doctor";
  username;

  constructor(
    private _auth : AuthService,
    private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
    this.username = this._auth.getUserDetails("username");
  }

 

}
