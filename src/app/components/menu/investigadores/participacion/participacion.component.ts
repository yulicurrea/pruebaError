import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { SearchService } from '../../services/search.service';
import { forkJoin } from 'rxjs';
import { UsuarioSesion } from '../../modelo/usuario';
import { AutenticacionService } from '../../services/autenticacion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { DialogoDetalleComponent } from '../../administrador/control/dialogo-detalle/dialogo-detalle.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-participacion',
  templateUrl: './participacion.component.html',
  styleUrls: ['./participacion.component.css'],
  standalone: true,
  imports: [
    MatCardModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule,
    MatTabsModule,
    MatTabsModule, 
    MatTableModule, 
    MatPaginatorModule, 
    CommonModule, 
    MatListModule,
    MatButtonModule,
    MatTooltipModule
  ],
})
export class ParticipacionComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['tipo', 'titulo', 'fecha', 'estado','updated_at','created_at','acciones'];
  dataSource = new MatTableDataSource<any>([]);
  usuarioSesion!: UsuarioSesion;

  proyectosData: any[] =[];
  productosData: any[] =[];

  constructor(
    private searchService: SearchService,
    private AutenticacionService:AutenticacionService,
    private ProyectoyproductoService:ProyectoyproductoService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.searchService.getSearchQuery().subscribe(query => {
    this.dataSource.filter = query.trim().toLowerCase();
    this.obtenerDatosUsuarioSesion();
    this.obtenerProyectos();
    });
  }


  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
  }

  obtenerProyectos(){
    this.ProyectoyproductoService.getProyectos().subscribe(resp => {
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    forkJoin([
      this.ProyectoyproductoService.getProyectos(),
      this.ProyectoyproductoService.getProductos()
    ]).subscribe(([proyectos, productos]) => {

      this.proyectosData = proyectos;
      this.productosData = productos;

      const proyectosAjustados = proyectos.filter(x => x.coinvestigador.includes(this.usuarioSesion.numerodocumento)).map(proyecto => ({
        ...proyecto,
        tituloProducto: proyecto.titulo,
        etapa: proyecto.etapa,
        fecha: proyecto.fecha,
        tipo: 'Proyecto',
        updated_at: proyecto.updated_at,
        created_at: proyecto.created_at,
        // Añadir las demás propiedades según sea necesario
      }));
      // Ajustar los datos de los productos para asegurarse de que tengan todas las propiedades definidas en la interfaz Producto
      const productosAjustados = productos.filter(x => x.coinvestigador.includes(this.usuarioSesion.numerodocumento)).map(producto => ({
        ...producto,
        tipo: 'Producto',
        tituloProducto: producto.tituloProducto || '', // Asegurar que todas las propiedades definidas en la interfaz Producto estén presentes
        fecha: producto.fecha || '',
        estadoProducto: producto.estado_producto || '',
        tipologiaProducto: producto.tipologiaProducto || '',
        updated_at: producto.updated_at,
        created_at: producto.created_at,
      }));
    
      // Concatenar los datos ajustados de proyectos con los datos de productos
      const combinedData = [...proyectosAjustados, ...productosAjustados];
      
      // Asignar los datos combinados a dataSource
      this.dataSource.data = combinedData;
      //obj.sort((a, b) => (a > b ? -1 : 1))
    });
  }


  accionUno(element: any) {
    console.log("Editar")
  }

  accionDos(element: any) {
    console.log("Editar")
  }

  openDialogoDetalle(data: any, tipo:string): void {
    const dialogRef = this.dialog.open(DialogoDetalleComponent, {
      data: {
        title: 'Detalle '+tipo,
        buttonTitle: 'CREAR',
        type: tipo,
        data:tipo==='Proyecto' ? this.proyectosData.find(x => x.codigo === data.codigo) : this.productosData.find(x => x.id === data.id),
        isEdit: false
      },
      disableClose: true,
      panelClass: "dialog-responsive"
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result',result);
      } 
    });
  }

}


