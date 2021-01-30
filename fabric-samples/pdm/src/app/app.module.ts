import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UpdateComponent } from './update/update.component';
import { ReadComponent } from './read/read.component';
import { AccessComponent } from './access/access.component';
import { AuthModule } from './auth/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AdminComponent } from './view/admin/admin.component';
import { PatientComponent } from './view/patient/patient.component';
import { DoctorComponent } from './view/doctor/doctor.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateComponent,
    ReadComponent,
    AccessComponent,
    AdminComponent,
    PatientComponent,
    DoctorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
