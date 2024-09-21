import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PerfilAdministradorComponent } from "./perfil-administrador/perfil-administrador.component";
import { Router, RouterModule } from '@angular/router';
import { SearchService } from '../services/search.service';
import {MatBadgeModule} from '@angular/material/badge';
import { InvestigadorService } from '../services/registroInvestigador';
import { UsuarioSesion } from '../modelo/usuario';
import { AutenticacionService } from '../services/autenticacion';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { DialogoNotificacionesComponent } from './dialogo-notificaciones/dialogo-notificaciones.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectorRef } from '@angular/core';  

import { Subject , of} from 'rxjs';
import { takeUntil ,  catchError} from 'rxjs/operators';

@Component({
    selector: 'app-administrador',
    templateUrl: './administrador.component.html',
    styleUrls: ['./administrador.component.css'],
    standalone: true,
    imports: [
      MatToolbarModule, 
      MatButtonModule, 
      MatIconModule, 
      MatInputModule, 
      MatFormFieldModule, 
      PerfilAdministradorComponent,
      RouterModule,
      MatBadgeModule,
      MatMenuModule,
      CommonModule,
      MatDialogModule,
      MatTooltipModule
    ]
})


export class AdministradorComponent implements OnInit {
    
    usuarios: any[] = [];
    notificaciones: any[] = [];
    notificacionesHistorial: any[] = [];
    private unsubscribe$ = new Subject<void>();
    private notificacionesLeidasLocalmente: Set<string> = new Set();

    constructor(
      private searchService: SearchService,
      private investigadorService: InvestigadorService,
      private AutenticacionService:AutenticacionService,
      private dialog: MatDialog,
      private router: Router,
      private cdr: ChangeDetectorRef
    ) {} 
    
    getNombreAbreviado(): string {
      if (this.usuarioSesion) {
        const nombre = this.usuarioSesion.nombre; // Nombre
        const apellidos = this.usuarioSesion.apellidos; // Apellidos
    
        if (nombre && apellidos) {
          const nombres = nombre.split(' '); // Dividir el nombre en partes si hay más de un nombre
          const inicialNombre = nombres[0].charAt(0); // Inicial del primer nombre
    
          // Dividir los apellidos y tomar el primer apellido
          const apellidosPartidos = apellidos.split(' ');
          const primerApellido = apellidosPartidos.length > 0 ? apellidosPartidos[0] : '';
    
          return `${inicialNombre}. ${primerApellido}`;
        } else if (nombre) {
          // Solo nombre sin apellidos
          const inicialNombre = nombre.charAt(0);
          return `${inicialNombre}.`;
        }
      }
      return ''; // Retornar vacío si no hay datos
    }
    

    ngOnInit() {
      this.obtenerDatosUsuarioSesion();
      this.obtenerNotificaciones();
    }
    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  

    openDialogoNotificaciones(): void {
      const dialogRef = this.dialog.open(DialogoNotificacionesComponent, {
        data: {
          title: 'Notificaciones',
          buttonTitle: 'CREAR',
          data: this.notificacionesHistorial
        },
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        } 
      });
    }

    usuarioSesion!: UsuarioSesion;
    obtenerDatosUsuarioSesion(){
      this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
    }

    obtenerNotificaciones() {

      this.investigadorService.getNotifications()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (data) => {
            this.actualizarNotificaciones(data);
          },
          (error) => {
            console.error('Error al obtener notificaciones:', error);
          }
        );
    }
 
   actualizarNotificaciones(data: any[]) {
    this.notificacionesHistorial = data
      .filter(x => x.destinatario === this.usuarioSesion.numerodocumento)
      .sort((a, b) => (a.id > b.id ? -1 : 1));
    
    this.notificaciones = this.notificacionesHistorial
      .filter(x => x.estado && !this.notificacionesLeidasLocalmente.has(x.id));
    
    console.log('Notificaciones actualizadas:', this.notificaciones);
    console.log('Historial de notificaciones actualizado:', this.notificacionesHistorial);
    
    this.cdr.detectChanges();
  }

  limpiarNotificacion(notificacion: any) {
    if (!notificacion || !notificacion.id) {
      console.error('Notificación no válida o ID de notificación no definido');
      return;
    }

    console.log('Intentando limpiar notificación:', notificacion);

    this.investigadorService.leerNotificacion({ id: notificacion.id, estado: false })
    .pipe(
      takeUntil(this.unsubscribe$),
      catchError(error => {
        console.error('Error al marcar la notificación como leída:', error);
        return of(null);
      })
    )
    .subscribe(
      (response) => {
        console.log('Respuesta del servidor al marcar como leída:', response);
  
        // Marcar la notificación como leída localmente
        this.notificacionesLeidasLocalmente.add(notificacion.id);
  
        // Actualizar las listas de notificaciones
        this.notificaciones = this.notificaciones.filter(n => n.id !== notificacion.id);
        const index = this.notificacionesHistorial.findIndex(n => n.id === notificacion.id);
        if (index !== -1) {
          this.notificacionesHistorial[index].estado = false;
        }
  
        // Forzar una actualización de la vista
        this.cdr.detectChanges();
  
        // Volver a cargar todas las notificaciones después de un breve retraso
        setTimeout(() => this.obtenerNotificaciones(), 1000);
      }
    );
  }
  

    onSearchInputChange(event: any) {
      this.searchService.setSearchQuery(event.target.value);
    }

    navigateSection(route:string): any {
      this.router.navigate([route]);
    }

    logout() {
      this.AutenticacionService.logout(); // Llama al método logout() del servicio de autenticación
    }
}
