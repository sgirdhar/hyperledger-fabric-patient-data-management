import { NotfoundComponent } from './notfound/notfound.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './view/admin/admin.component';
import { DoctorComponent } from './view/doctor/doctor.component';
import { PatientComponent } from './view/patient/patient.component';
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
