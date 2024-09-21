import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';
//componentes

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './components/shared/shared.module';
import { ResetPasswordDialogComponent } from './components/menu/navbar/reset-password-dialog/reset-password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({ declarations: [
        AppComponent,
        ResetPasswordDialogComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MatSlideToggleModule,
        MatDialogModule,
        CommonModule,MatNativeDateModule,], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { 
   
}