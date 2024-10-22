import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion'; 
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
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

      <!-- Animación de carga mientras el proceso está activo -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-container">
          <i class="fas fa-spinner fa-spin"></i>
          <span class="loading-text">Cargando...</span>
        </div>
      </div>
    </form>
  `,
  styles: [`
    /* Fondo borroso para la superposición de carga */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8); /* Fondo semi-transparente */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    /* Estilos del contenedor de la animación de carga */
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      padding: 15px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease-in-out;
    }

    /* Estilos del texto y el ícono de carga */
    .loading-text {
      margin-left: 10px;
      font-size: 18px;
      color: #6AABA0;
      font-weight: bold;
    }

    .fa-spinner {
      font-size: 24px;
      color: #6AABA0;
    }

    /* Animación para la transición suave */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ResetPasswordDialogComponent {
  resetPasswordForm: FormGroup;
  isLoading = false; // Control de estado de carga
  resetInProgress = false; // Control para evitar múltiples envíos

  constructor(private fb: FormBuilder, private authService: AutenticacionService, private dialogRef: MatDialogRef<ResetPasswordDialogComponent>) {
    this.resetPasswordForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid && !this.resetInProgress) {
      this.isLoading = true; // Iniciar carga
      this.resetInProgress = true; // Evitar nuevos envíos
      const correo = this.resetPasswordForm.get('correo')?.value;

      this.authService.resetPassword(correo).subscribe(
        () => {
          this.isLoading = false;
          this.resetInProgress = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.',
          });
          this.dialogRef.close();
        },
        (error) => {
          this.isLoading = false;
          this.resetInProgress = false;
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
