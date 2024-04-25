import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    MenuComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
})
export class MenuModule {
  panelOpenState = false;
 
}