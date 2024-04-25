import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../modelo/productos';
import { Proyecto } from '../modelo/proyectos';
import { AutenticacionService } from './autenticacion';
@Injectable({
  providedIn: 'root' // Asegúrate de tener este providedIn en tu servicio
})

export class ProyectoyproductoService {
  
  constructor(private http: HttpClient,private  AutenticacionService:AutenticacionService) { }
  
  //Mostrar proyectos y productos

  private apiUrl3 = 'http://localhost:8000/proyecto';
  private apiEstadoProyecto = 'http://localhost:8000/estadoproyecto';

  getProyectos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl3}`);
  }
  
  private apiUrl4 = 'http://localhost:8000/producto';
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl4}`);
  }
  //proyectos del investigador autenticado
  getProyectosDelUsuario(): Observable<any[]> {
    const numeroDocumento = this.AutenticacionService.obtenerDatosUsuario().numerodocumento; // Suponiendo que 'numeroDocumento' es la clave que contiene el número de documento en los datos del usuario
    return this.http.get<any[]>(this.apiUrl3).pipe(
      map((proyectos: any[]) => proyectos.filter(proyecto => proyecto.investigador === numeroDocumento))
  );
  }

  private apiUrl5 = 'http://localhost:8000/mostrarProductos';

  getProductosDelUsuario(): Observable<any[]> {
    const numeroDocumento = this.AutenticacionService.obtenerDatosUsuario().numerodocumento;
    return this.http.get<any[]>(this.apiUrl4).pipe(
        map((productos: any[]) => {
            return productos.filter(producto => producto.investigador === numeroDocumento);
        })
    );
}


  //Crear proyectos y productos
    private apiUrl = 'http://localhost:8000/CrearProyecto';
    crearProyecto(proyecto: Proyecto): Observable<Proyecto> {
      return this.http.post<Proyecto>(this.apiUrl, this.convertirObjetoProyectoAFormData(proyecto));
  }

  convertirObjetoProyectoAFormData(datosFormulario: any): FormData {
    datosFormulario.entidadPostulo = JSON.stringify(datosFormulario.entidadPostulo);
    datosFormulario.entregableAdministrativo = JSON.stringify(datosFormulario.entregableAdministrativo);
    datosFormulario.financiacion = JSON.stringify(datosFormulario.financiacion);
    datosFormulario.producto= JSON.stringify(datosFormulario.producto);
    datosFormulario.transacciones= JSON.stringify(datosFormulario.transacciones);
    datosFormulario.ubicacionProyecto = JSON.stringify(datosFormulario.ubicacionProyecto);
    const keys = Object.keys(datosFormulario);
    const form = new FormData();
    keys.forEach(key => {
      form.append(key, datosFormulario[key]);
    });
    return form;
  }
    
    
    
  private apiUrl2 = 'http://localhost:8000/CrearProducto';
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl2, this.convertirObjetoProductoAFormData(producto));
  }

  convertirObjetoProductoAFormData(datosFormulario: any): FormData {
    datosFormulario.listaProducto = JSON.stringify(datosFormulario.listaProducto);
    const keys = Object.keys(datosFormulario);
    const form = new FormData();
    keys.forEach(key => {
      form.append(key, datosFormulario[key]);
    });
    return form;
  }

  getEstadoProyecto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEstadoProyecto}`);
  }

  private apiEventos = 'http://localhost:8000/tipoEventos';
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEventos}`);
  }

  private apiProyecto = 'http://localhost:8000/proyecto'; 
  actualizarProyecto(proyecto: Proyecto) {
    const url = `${this.apiProyecto}/${proyecto.codigo}`;
    return this.http.put(url, proyecto).pipe(
      catchError(error => {
        if(error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              // El investigador no existe
              return throwError('Investigador no encontrado');
            case 400:
              // Datos inválidos
              return throwError('Datos de investigador inválidos'); 
            default:
              return throwError('Error al actualizar investigador');
          }
        }
        return throwError('Error desconocido');
      })
    );
  }

  private apiProducto = 'http://localhost:8000/producto'; 
  actualizarProducto(proyecto: any) {
    const url = `${this.apiProducto}/${proyecto.id}`;
    return this.http.put(url, proyecto).pipe(
      catchError(error => {
        if(error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              // El investigador no existe
              return throwError('Investigador no encontrado');
            case 400:
              // Datos inválidos
              return throwError('Datos de investigador inválidos'); 
            default:
              return throwError('Error al actualizar investigador');
          }
        }
        return throwError('Error desconocido');
      })
    );
  }

  obtenerEstadosProyecto(): Observable<any[]> {
    return this.http.get<any[]>(this.apiEstadoProyecto);
  }

  private apiEstadoProducto = 'http://localhost:8000/estadoproducto'; 
  obtenerEstadosProducto(): Observable<any[]> {
    return this.http.get<any[]>(this.apiEstadoProducto);
  }

  private apiConfiguracionEntregableProducto = 'http://localhost:8000/configuracionEntregableProducto'; 

  configurarEntregablesProducto(registro: any) {
    return this.http.post<any>(this.apiConfiguracionEntregableProducto, registro);
  }

  obtenerEntregablesProducto() {
    return this.http.get<any[]>(`${this.apiConfiguracionEntregableProducto}`);
  }

  actualizarEntregableProducto(proyecto: any) {
    const url = `${this.apiConfiguracionEntregableProducto}/${proyecto.id}`;
    return this.http.put(url, proyecto).pipe(
      catchError(error => {
        if(error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              // El investigador no existe
              return throwError('Investigador no encontrado');
            case 400:
              // Datos inválidos
              return throwError('Datos de investigador inválidos'); 
            default:
              return throwError('Error al actualizar investigador');
          }
        }
        return throwError('Error desconocido');
      })
    );
  }

  private apiConfiguracionEntregableProyecto = 'http://localhost:8000/configuracionEntregableProyecto'; 

  configurarEntregablesProyecto(registro: any) {
    return this.http.post<any>(this.apiConfiguracionEntregableProyecto, registro);
  }

  obtenerEntregablesProyecto() {
    return this.http.get<any[]>(`${this.apiConfiguracionEntregableProyecto}`);
  }

  actualizarEntregableProyecto(proyecto: any) {
    const url = `${this.apiConfiguracionEntregableProyecto}/${proyecto.id}`;
    return this.http.put(url, proyecto).pipe(
      catchError(error => {
        if(error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              // El investigador no existe
              return throwError('Investigador no encontrado');
            case 400:
              // Datos inválidos
              return throwError('Datos de investigador inválidos'); 
            default:
              return throwError('Error al actualizar investigador');
          }
        }
        return throwError('Error desconocido');
      })
    );
  }


  private apiAvanceEntregableProyecto = 'http://127.0.0.1:8000/avanceEntregableProyecto'; 

  avanceEntregablesProyecto(registro: any) {
    return this.http.post<any>(this.apiAvanceEntregableProyecto, this.convertirObjetoAvanceAFormData(registro));
  }

  obtenerAvancesProyecto() {
    return this.http.get<any[]>(`${this.apiAvanceEntregableProyecto}`);
  }

  private apiAvanceEntregableProducto = 'http://127.0.0.1:8000/avanceEntregableProducto'; 

  avanceEntregablesProducto(registro: any) {
    return this.http.post<any>(this.apiAvanceEntregableProducto, this.convertirObjetoAvanceAFormData(registro));
  }

  obtenerAvancesProducto() {
    return this.http.get<any[]>(`${this.apiAvanceEntregableProducto}`);
  }

  convertirObjetoAvanceAFormData(datosFormulario: any): FormData {
    const keys = Object.keys(datosFormulario);
    const form = new FormData();
    keys.forEach(key => {
      form.append(key, datosFormulario[key]);
    });
    return form;
  }

  //Crear notificacion
  private apiNotificacion = 'http://localhost:8000/notificaciones';
  notificar(notificacion: any): Observable<Proyecto> {
    return this.http.post<any>(this.apiNotificacion, notificacion);
  }


}