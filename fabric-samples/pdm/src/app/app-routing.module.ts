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
    component : UpdateHealthRecordComponent
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
