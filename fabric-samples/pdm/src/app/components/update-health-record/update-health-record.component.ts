import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { NgForm } from '@angular/forms';
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
  

  constructor(private _auth : AuthService,
              private _api : ApiService) { }

  ngOnInit(): void {
    this.isDoctor = this._auth.isUserDoctor(); 
  }

  updatePatientHealthRecord

  UpdateHealthRecord(form : NgForm){
    
    let payload = { username : this._auth.getUserDetails("username"),
                    doctorId : this._auth.getUserDetails("username"),
                    role : this._auth.getUserDetails("userData"),
                    id :this._auth.getUserDetails("username"),
                    org : "Hospital1",
                    patientId : form.value.patientId,
                    diagnosis : form.value.diagnosis,
                    medication : form.value.medication
                  }
    console.log(payload);
    
    this._api.postTypeRequest("updatePatientHealthRecord",payload).subscribe((res : any)=>{
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
