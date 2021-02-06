import { NgForm } from '@angular/forms';
import { AuthService } from './../../services/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/services/api.service';
import { User } from 'src/app/user';

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

  constructor(
    private _auth : AuthService,
    private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
  }

 

}
