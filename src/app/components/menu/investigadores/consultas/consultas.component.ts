import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Asegúrate de importar MatPaginator desde '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { InvestigadorService } from '../../services/registroInvestigador';
import { SearchService } from '../../services/search.service';
import { DialogoDetalleComponent } from '../../administrador/control/dialogo-detalle/dialogo-detalle.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  standalone: true,
  imports: [
    MatTabsModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatExpansionModule, 
    CommonModule, 
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
})

export class ConsultasComponent {

  //proyectos y productos
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['tipo','titulo', 'investigador', 'fecha','updated_at','created_at', 'estado','acciones'];
  //investigadores
  dataSource2 = new MatTableDataSource<any>([]);
  displayedColumns2: string[] = ['numerodocumento', 'nombres','correo','created_at','grupo', 'detalles'];
  expandedElement: any | null = null;

  proyectosData: any[] =[];
  productosData: any[] =[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  constructor(
    private searchService: SearchService,
    private ProyectoyproductoService:ProyectoyproductoService, 
    private InvestigadorService:InvestigadorService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    
    forkJoin([
      this.ProyectoyproductoService.getProyectos(),
      this.ProyectoyproductoService.getProductos()
    ]).subscribe(([proyectos, productos]) => {

      this.proyectosData = proyectos;
      this.productosData = productos;

      const productosConTipo = productos.map(producto => ({
        ...producto,
        tipo: 'Producto',
        tituloProducto: producto.tituloProducto || '', // Asegurar que todas las propiedades definidas en la interfaz Producto estén presentes
        fecha: producto.fecha || '',
        estadoProducto: producto.estado_producto || '',
        tipologiaProducto: producto.tipologiaProducto || '',
        updated_at: producto.updated_at,
        created_at: producto.created_at,
      }));
    
      // Convertir los datos de proyectos a la misma estructura que productos
      const proyectosAjustados = proyectos.map(proyecto => ({
        ...proyecto,
        tituloProducto: proyecto.titulo,
        etapa: proyecto.etapa,
        fecha: proyecto.fecha,
        tipo: 'Proyecto',
        updated_at: proyecto.updated_at,
        created_at: proyecto.created_at,
      }));
    
      // Concatenar los datos ajustados de proyectos con los datos de productos
      const combinedData = [...proyectosAjustados, ...productosConTipo];
      
      // Asignar los datos combinados a dataSource
      this.dataSource.data = combinedData;
    });
    //INVESTIGADORES

    this.InvestigadorService.getInvestigadores().subscribe(investigadores => {
      console.log('investigadores =>',investigadores);
      this.dataSource2.data = investigadores;
    });
    
  
    this.searchService.getSearchQuery().subscribe(query => {
      this.dataSource.filter = query.trim().toLowerCase();
      this.dataSource2.filter = query.trim().toLowerCase();
    });
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
 
  // -------------------------TABLA INVESTIGADORES --------------------
  
  toggleExpansion(element: Element): void {
    this.expandedElement = this.expandedElement === element ? null : element;
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
