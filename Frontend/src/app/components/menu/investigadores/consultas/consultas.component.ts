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

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  standalone: true,
  imports: [MatTabsModule, MatTableModule, MatPaginatorModule, MatExpansionModule, CommonModule, MatListModule],
})

export class ConsultasComponent {

  //proyectos y productos
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['tipo','titulo', 'investigador', 'fecha', 'estado'];
  //investigadores
  dataSource2 = new MatTableDataSource<any>([]);
  displayedColumns2: string[] = ['nombres', 'grupo', 'detalles'];
  expandedElement: any | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  constructor(private searchService: SearchService,private ProyectoyproductoService:ProyectoyproductoService, private InvestigadorService:InvestigadorService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    
    forkJoin([
      this.ProyectoyproductoService.getProyectos(),
      this.ProyectoyproductoService.getProductos()
    ]).subscribe(([proyectos, productos]) => {
      const productosConTipo = productos.map(producto => ({
        ...producto,
        tipo: 'Producto'
      }));
    
      // Convertir los datos de proyectos a la misma estructura que productos
      const proyectosAjustados = proyectos.map(proyecto => ({
        tituloProducto: proyecto.titulo,
        investigador: proyecto.investigador, // Debes asegurarte de que "investigador" incluye el nombre y apellido
        fecha: proyecto.fecha,
        estadoProducto: proyecto.estadoProyecto,
        tipo: 'Proyecto'
      }));
    
      // Concatenar los datos ajustados de proyectos con los datos de productos
      const combinedData = [...proyectosAjustados, ...productosConTipo];
      
      // Asignar los datos combinados a dataSource
      this.dataSource.data = combinedData;
    });
    //INVESTIGADORES

    this.InvestigadorService.getInvestigadores().subscribe(investigadores => {
      this.dataSource2.data = investigadores;
    });
    
  
    this.searchService.getSearchQuery().subscribe(query => {
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
  
}
