import { AuthService } from './../../services/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  isPatient : boolean = false;
  constructor(private _auth: AuthService) { }

  ngOnInit(): void {
    this.isPatient = this._auth.isUserPatient();
  }

}
