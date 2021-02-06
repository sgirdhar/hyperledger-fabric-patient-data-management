import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UpdateComponent } from './components/update/update.component';
import { ReadComponent } from './components/read/read.component';
import { AccessComponent } from './components/access/access.component';
import { AuthModule } from './auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { AdminComponent } from './view/admin/admin.component';
import { PatientComponent } from './view/patient/patient.component';
import { DoctorComponent } from './view/doctor/doctor.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpdateHealthRecordComponent } from './components/update-health-record/update-health-record.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateComponent,
    ReadComponent,
    AccessComponent,
    PatientComponent,
    DoctorComponent,
    AdminComponent,
    NotfoundComponent,
    UpdateHealthRecordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
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
