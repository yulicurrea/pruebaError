import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion';
import { SearchService } from '../services/search.service';
import { DialogoNotificacionesComponent } from '../administrador/dialogo-notificaciones/dialogo-notificaciones.component';
import { UsuarioSesion } from '../modelo/usuario';
import { InvestigadorService } from '../services/registroInvestigador';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PerfilAdministradorComponent } from '../administrador/perfil-administrador/perfil-administrador.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invesigadores',
  templateUrl: './invesigadores.component.html',
  styleUrls: ['./invesigadores.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    RouterModule,
    PerfilAdministradorComponent,
    MatBadgeModule,
    MatMenuModule,
    CommonModule,
    MatDialogModule
  ],
})

export class InvesigadoresComponent implements OnInit {
  usuarios: any[] = [];
  notificaciones: any[] = [];
  notificacionesHistorial: any[] = [];

  constructor(
    private searchService: SearchService, 
    private AutenticacionService:AutenticacionService,
    private investigadorService: InvestigadorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.obtenerDatosUsuarioSesion();
    this.obtenerNotificaciones();
  }

  onSearchInputChange(event: any) {
    this.searchService.setSearchQuery(event.target.value);
  }

  usuarioSesion!: UsuarioSesion;
  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
  }

  obtenerNotificaciones() {
    this.investigadorService.getNotifications().subscribe(
      (data) => {
        this.notificaciones = data.filter(x => x.destinatario === this.usuarioSesion.numerodocumento && x.estado).sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));
        this.notificacionesHistorial = data.filter(x => x.destinatario === this.usuarioSesion.numerodocumento).sort((a, b) => (Number(a.id) > Number(b.id) ? -1 : 1));
      },
      (error) => {
        console.error('Error al obtener notificaciones:', error);
      }
    );
  }

  openDialogoNotificaciones(): void {
    const dialogRef = this.dialog.open(DialogoNotificacionesComponent, {
      data: {
        title: 'Notificaciones',
        buttonTitle: 'CREAR',
        data: this.notificacionesHistorial
      },
      width: '50%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } 
    });
  }

  limpiarNotificacion(notificacion:any) {
    this.investigadorService.leerNotificacion(notificacion).subscribe(
      (data) => {
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al obtener notificaciones:', error);
      }
    );
  }

  logout() {
    this.AutenticacionService.logout(); // Llama al método logout() del servicio de autenticación
  }
}
