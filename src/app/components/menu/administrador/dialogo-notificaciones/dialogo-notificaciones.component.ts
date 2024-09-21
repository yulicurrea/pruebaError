import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvestigadorService } from '../../services/registroInvestigador';

@Component({
  selector: 'app-dialogo-notificaciones',
  standalone: true,
  templateUrl: './dialogo-notificaciones.component.html',
  styleUrls: ['./dialogo-notificaciones.component.css'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgFor,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
  ],
})
export class DialogoNotificacionesComponent implements OnInit {
  displayedColumns: string[] = ['asunto', 'mensaje', 'remitente', 'created_at'];
dataSource: MatTableDataSource<any>;

buttonTitle!: string;
title!: string;
data!: any;
usuariosData: any[] = [];

constructor(
  @Inject(MAT_DIALOG_DATA) public dialogData: {
    title: string,
    buttonTitle: string,
    data: any,
  },
  private readonly dialogRef: MatDialogRef<DialogoNotificacionesComponent>,
  private investigatorService: InvestigadorService,
) { 
  // Inicializa el dataSource con una tabla vacía
  this.dataSource = new MatTableDataSource<any>([]);
}

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngOnInit() {
  // Asigna los valores del dialogData a las propiedades de la clase
  this.title = this.dialogData.title;
  this.buttonTitle = this.dialogData.buttonTitle;
  this.data = this.dialogData.data;
  
  // Procesa las notificaciones para mostrarlas en la tabla
  this.procesaNotificaciones();
}

ngAfterViewInit() {
  // Asigna el paginador al dataSource después de la vista inicializada
  this.dataSource.paginator = this.paginator;
}

procesaNotificaciones() {
  // Llama al servicio para obtener los usuarios y procesar las notificaciones
  this.investigatorService.getUsuarios().subscribe((data) => {
    // Almacena los datos de los usuarios obtenidos
    this.usuariosData = data;

    // Mapea los datos de las notificaciones para incluir información del remitente
    this.dataSource.data = this.data.map((x: { remitente: any; estado: any; asunto: any; mensaje: any; created_at: any; }) => {
      // Encuentra el usuario correspondiente al remitente de la notificación
      const user = this.usuariosData.find(data => data.numerodocumento === x.remitente);

      const remitenteNombre = user ? `${user.nombre} ${user.apellidos} ${user.correo}` : 'Remitente desconocido';

      // Retorna un nuevo objeto con los datos de la notificación y la información del remitente
      return {
        asunto: x.asunto,
        mensaje: x.mensaje,
        remitente: remitenteNombre,
        estado: x.estado,
        created_at: x.created_at,
      }
    });
  });
}

}
