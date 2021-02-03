import { AuthService } from './../../services/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    isAdmin : boolean = false;
  constructor(private _auth : AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this._auth.isUserAdmin();
  }

}
