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

    constructor(
      private searchService: SearchService,
      private investigadorService: InvestigadorService,
      private AutenticacionService:AutenticacionService,
      private dialog: MatDialog,
      private router: Router,
    ) {}

    ngOnInit() {
      this.obtenerDatosUsuarioSesion();
      this.obtenerNotificaciones();
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
