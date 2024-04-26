import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchService } from '../../services/search.service';
import { MatTableDataSource } from '@angular/material/table';
import { InvestigadorService } from '../../services/registroInvestigador';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.css'],
  standalone: true,
  imports: [MatTabsModule, MatSlideToggleModule, MatDividerModule, MatListModule, MatMenuModule, MatButtonModule, MatTableModule, MatPaginatorModule],
})
export class EstadosComponent {
  displayedColumns = ['Nombre', 'Rol', 'Estado', 'Fecha'];
  dataSource: MatTableDataSource<any>;
  
  displayedColumns2 = ['Nombre', 'Lider', 'Estado', 'Fecha'];
  dataSource2: MatTableDataSource<PeriodicElement2>;
 
  displayedColumns3 = ['Nombre', 'Lider', 'Estado', 'Fecha'];
  dataSource3: MatTableDataSource<PeriodicElement3>;

  constructor(private searchService: SearchService, private investigadorService:InvestigadorService) {
 
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource2 = new MatTableDataSource<any>([]);
    this.dataSource3 = new MatTableDataSource<any>([]);
  }
  ngOnInit() {
    this.getData();
    this.searchService.getSearchQuery().subscribe(query => {
      // Aplica el filtro a dataSource
      this.dataSource.filter = query.trim().toLowerCase();
      
      // Aplica el filtro a dataSource2
      this.dataSource2.filter = query.trim().toLowerCase();
      
      // Aplica el filtro a dataSource3
      this.dataSource3.filter = query.trim().toLowerCase();
    });

   
  }
  getData() {
  this.investigadorService.getUsuarios().subscribe(data => {
    this.dataSource = new MatTableDataSource(data);
  });
}

  
}



export interface PeriodicElement {
  nombre: string;
  rolinvestigador: String;
  estado: String;
  fecha: string;
  }

export interface PeriodicElement2 {
  Nombre: string;
  Lider: String;
  Estado: String;
  Fecha: string;
}

export interface PeriodicElement3 {
  Nombre: string;
  Lider: String;
  Estado: String;
  Fecha: string;
}


const ELEMENT_DATA2: PeriodicElement2[] = [
  {Nombre: 'IOT', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'TiP', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'Hola', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'Prueba', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'Pro', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'MOM', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'Lop', Lider: 'Hydrogen', Estado:'Activo', Fecha: 'H'},
];

const ELEMENT_DATA3: PeriodicElement3[] = [
  {Nombre: 'IOT', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'POP', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'LOL', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'KIK', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'QUE', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'DRE', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
  {Nombre: 'PUE', Lider: 'Laura', Estado:'Activo', Fecha: 'H'},
];