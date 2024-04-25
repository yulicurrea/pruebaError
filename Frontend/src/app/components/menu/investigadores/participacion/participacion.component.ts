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

@Component({
  selector: 'app-participacion',
  templateUrl: './participacion.component.html',
  styleUrls: ['./participacion.component.css'],
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatPaginatorModule, MatIconModule],
})
export class ParticipacionComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['tipo', 'titulo', 'fecha', 'estado', 'etapa', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  usuarioSesion!: UsuarioSesion;

  constructor(
    private searchService: SearchService,
    private AutenticacionService:AutenticacionService,
    private ProyectoyproductoService:ProyectoyproductoService) {}

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
      this.ProyectoyproductoService.getProyectosDelUsuario(),
      this.ProyectoyproductoService.getProyectos()
    ]).subscribe(([productos, proyectos]) => {

      // Ajustar los datos de los productos para asegurarse de que tengan todas las propiedades definidas en la interfaz Producto
      const productosAjustados = productos.map(producto => ({
        ...producto,
        tipo: 'Producto',
        id:producto.id,
        tituloProducto: producto.titulo_producto || '', // Asegurar que todas las propiedades definidas en la interfaz Producto estén presentes
        fecha: producto.fecha || '',
        estadoProducto: producto.estado_producto || '',
        etapa:producto.etapa|| '',
        tipologiaProducto: producto.tipologiaProducto || '',
      }));
      
      // Convertir los datos de proyectos a la misma estructura que productos
      const proyectosAjustados = proyectos.filter(x => x.coinvestigador.includes(this.usuarioSesion.numerodocumento)).reverse().map(proyecto => ({
        tituloProducto: proyecto.titulo,
        etapa: proyecto.etapa,
        fecha: proyecto.fecha,
        estadoProceso: proyecto.estadoProceso,
        tipo: 'Proyecto',
        // Añadir las demás propiedades según sea necesario
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

}


