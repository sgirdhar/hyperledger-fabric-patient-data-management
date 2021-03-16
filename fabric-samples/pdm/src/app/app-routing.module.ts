import { UpdateHealthRecordComponent } from './components/update-health-record/update-health-record.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './view/admin/admin.component';
import { DoctorComponent } from './view/doctor/doctor.component';
import { PatientComponent } from './view/patient/patient.component';
import { ReadComponent } from './components/read/read.component';
import { UpdateComponent } from './components/update/update.component';
import { GrantAccessComponent } from './components/grant-access/grant-access.component';
import { RevokeAccessComponent } from './components/revoke-access/revoke-access.component';

const routes: Routes = [
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'admin',
    component:AdminComponent
  },
  {
    path: 'register', 
    component: RegisterComponent
  },
  {
    path: 'doctor', 
    component:DoctorComponent
  },
  {
    path:'patient', 
    component:PatientComponent
  },
  {
    path : 'read',
    component : ReadComponent
  },
  {
    path: 'updateHealthRecord',
    component : UpdateHealthRecordComponent}
    ,

  { path : 'update',
    component : UpdateComponent
  },
  {
    path : 'grant',
    component : GrantAccessComponent
  },
  {
    path : 'revoke',
    component : RevokeAccessComponent
  },
  {
    path: '', redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
      path: '404', 
      component: NotfoundComponent
  },
  {
    path: '**', 
    redirectTo:'/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
