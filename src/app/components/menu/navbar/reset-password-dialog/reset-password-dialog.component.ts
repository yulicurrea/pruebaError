import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion'; 
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  // formulario de ingresar el correo electronico
  selector: 'app-reset-password-dialog',
  template: `
    <h2 mat-dialog-title>Restablecer contraseña</h2>
    <form [formGroup]="resetPasswordForm" (ngSubmit)="resetPassword()">
      <mat-dialog-content>
        <p>Ingrese su correo electrónico para restablecer su contraseña.</p>
        <mat-form-field>
          <input matInput placeholder="Correo electrónico" formControlName="correo" required>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button type="button" (click)="closeDialog()">Cancelar</button>
        <button type="submit" mat-raised-button color="primary" [disabled]="isLoading || resetInProgress">Enviar</button>
      </mat-dialog-actions>
      <div *ngIf="isLoading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Cargando... <!-- Icono de carga -->
      </div>
    </form>
  `,
  styles: [`
    .loading-message {
      display: flex;
      align-items: center;
      margin-top: 10px;
      font-size: 16px;
      color: #6AABA0; /* Color del texto */
    }
    .loading-message i {
      margin-right: 5px; /* Espaciado entre el icono y el texto */
    }
  `]
})
export class ResetPasswordDialogComponent {
  resetPasswordForm: FormGroup;
  isLoading = false; // Variable para controlar el estado de carga
  resetInProgress = false; // Variable para controlar si ya se ha iniciado un envío

  constructor(private fb: FormBuilder, private authService: AutenticacionService, private dialogRef: MatDialogRef<ResetPasswordDialogComponent>) {
    this.resetPasswordForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  // Valida el formulario y llama al servicio de autenticación para enviar la solicitud de restablecimiento de contraseña
  resetPassword() {
    if (this.resetPasswordForm.valid && !this.resetInProgress) {
      this.isLoading = true; // Iniciar carga
      this.resetInProgress = true; // Evitar nuevos envíos
      const correo = this.resetPasswordForm.get('correo')?.value;

      this.authService.resetPassword(correo).subscribe(
        () => {
          this.isLoading = false; // Finalizar carga
          this.resetInProgress = false; // Permitir nuevos envíos
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.',
          });
          this.dialogRef.close();
        },
        (error) => {
          this.isLoading = false; // Finalizar carga
          this.resetInProgress = false; // Permitir nuevos envíos
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el enlace para restablecer la contraseña. Por favor, intenta de nuevo.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
