import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/user';


@Component({
  selector: 'app-update-health-record',
  templateUrl: './update-health-record.component.html',
  styleUrls: ['./update-health-record.component.css']
})
export class UpdateHealthRecordComponent implements OnInit {
  patient : User[];
  returnsData : boolean = false;
  errorMessage;
  
  isDoctor : boolean = false;
  username:string;
  doctorId:string;
  role:string;
  id:string;
  patientId :string;
  org : string;
  


  constructor(private _auth : AuthService,
              private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor(); 
    this.username = this._auth.getUserDetails("username");
    this.doctorId = this._auth.getUserDetails("username");
    this.role = this._auth.getUserDetails("userData");
    this.id = this._auth.getUserDetails("username");
    this.patientId = this._auth.getUserDetails("patientId");
    this.org = this._auth.getUserDetails("org");
  }

 
  
  UpdateHealthRecord(form : NgForm){
    
    let payload = { username : this.username,
                    doctorId : this.doctorId,
                    id :this.id,
                    org : this._auth.getUserDetails("org"),
                    patientId : this._auth.getUserDetails("patientId"),
                    diagnosis : form.value.diagnosis,
                    medication : form.value.medication
                  }
    console.log(payload);
    
    this._api.postTypeRequest("updatePatientHealthRecord",payload).subscribe((res : any)=>{ 
      this.patient = Array.of(res);
      console.log(res);
      
    });
  }


  

}
