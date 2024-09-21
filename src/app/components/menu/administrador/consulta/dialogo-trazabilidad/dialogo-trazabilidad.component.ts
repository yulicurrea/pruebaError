import { Component, ViewChild,Inject  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notificacion } from '../../../modelo/trazabilidad';
import { Proyecto,Producto } from '../../../modelo/proyectos';
import { InvestigadorService } from '../../../services/registroInvestigador';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';


@Component({
  selector: 'app-dialogo-trazabilidad',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './dialogo-trazabilidad.component.html',
  styleUrls: ['./dialogo-trazabilidad.component.css']
})
export class DialogoTrazabilidadComponent {
  trazabilidadData = new MatTableDataSource<Notificacion>();
  displayedColumns: string[] = ['fecha', 'asunto', 'mensaje', 'remitente', 'destinatario'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: Proyecto | Producto, type: string }, // Define el tipo de 'data'
    private proyectoyproductoService: ProyectoyproductoService,
    private InvestigadorService:InvestigadorService
  ) {}

  ngOnInit(): void {
    this.loadTrazabilidadData();
  }

  ngAfterViewInit() {
    this.trazabilidadData.paginator = this.paginator;
  }

  loadTrazabilidadData() {
    const type = this.data.type; // Obtiene el tipo (proyecto o producto)
    const itemData = this.data.data; // Obtiene los datos del proyecto o producto seleccionado
  
    if (type === 'Proyecto' || type === 'Producto') {
      this.proyectoyproductoService.getTrazabilidadData().subscribe(response => {
        let notifications: Notificacion[] = [];
  
        if (type === 'Proyecto') {
          const proyecto = itemData as Proyecto; 
          const foundProyecto = response.proyectos.find((proy: Proyecto) => proy.codigo === proyecto.codigo);
          if (foundProyecto) {
            notifications = foundProyecto.notificaciones.filter((not: Notificacion) => not.id) as Notificacion[];
          }
        } else if (type === 'Producto') {
          const producto = itemData as Producto; 
          const foundProducto = response.productos.find((prod: Producto) => prod.id === producto.id);
          if (foundProducto) {
            notifications = foundProducto.notificaciones.filter((not: Notificacion) => not.id) as Notificacion[];
          }
        }
  
        // Obtener los usuarios para hacer la correspondencia
        this.InvestigadorService.getUsuarios().subscribe(usuarios => {
          // Crear un mapa para facilitar la búsqueda
          const usuariosMap = usuarios.reduce((map, user) => {
            map[user.numerodocumento] = `${user.nombre} ${user.apellidos}`; 
            return map;
          }, {});
  
          // Asignar los nombres a las notificaciones
          notifications.forEach(not => {
            if (not.remitente && usuariosMap[not.remitente]) {
              not.remitente = usuariosMap[not.remitente]; // Reemplaza el documento por el nombre
            }
            if (not.destinatario && usuariosMap[not.destinatario]) {
              not.destinatario = usuariosMap[not.destinatario]; // Reemplaza el documento por el nombre
            }
          });
  
          this.trazabilidadData.data = notifications; // Asigna las notificaciones filtradas a la tabla
        });
      });
    }
  }
  
  
  
  
}
