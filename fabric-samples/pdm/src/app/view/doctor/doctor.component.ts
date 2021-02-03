import { AuthService } from './../../services/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  isDoctor : boolean = false;
  constructor(private _auth : AuthService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor();
  }

}
