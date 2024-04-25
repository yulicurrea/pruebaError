import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Investigador } from '../modelo/investigador';

@Injectable({
  providedIn: 'root' // Asegúrate de tener este providedIn en tu servicio
})
export class InvestigadorService {
  private apiUrl = 'http://localhost:8000/investigador'; 
  private apiUrl2 = 'http://localhost:8000/grupoinvestigacion'; 
  private apiUrl3 = 'http://localhost:8000/mostrarInvestigador'; 
  private apiNotificaciones = 'http://localhost:8000/notificaciones'; 

  constructor(private http: HttpClient) { }

  // mostrar la informacion de todos los investigadores
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiNotificaciones}`);
  }

  leerNotificacion(notifica: any) {
    const url = `${this.apiNotificaciones}/${notifica.id}`;
    return this.http.put(url, notifica).pipe(
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

  getInvestigadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl3}`);
  }
  //getInvestigadores(): Observable<any[]> {
    //return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      //switchMap((investigadores: any[]) => {
        // Obtener los IDs únicos de los grupos de investigadores
        //const uniqueGrupoIds = new Set(investigadores.map(investigador => investigador.grupoinvestigacion));

        // Obtener el nombre de cada grupo
        //const observables = Array.from(uniqueGrupoIds).map(idGrupo => {
          //return this.http.get<Grupoinvestigacion>(`${this.apiUrl2}/${idGrupo}`).pipe(
            //map((grupo: Grupoinvestigacion) => ({ id: idGrupo, nombre: grupo.nombre }))
          //);
        //});

        // Combinar todas las solicitudes en paralelo
        //return forkJoin(observables).pipe(
          //map(grupos => {
            // Crear un mapa para buscar rápidamente el nombre del grupo por ID
            //const grupoMap = new Map(grupos.map(grupo => [grupo.id, grupo.nombre]));

            // Asignar el nombre del grupo a cada investigador
            //return investigadores.map(investigador => ({
              //...investigador,
              //nombre_grupo: grupoMap.get(investigador.grupoinvestigacion)
            //}));
          //})
        //);
      //})
    //);
  //}


  //registro
  registrarInvestigador(nuevoInvestigador: Investigador): Observable<Investigador> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    return this.http.post<Investigador>(this.apiUrl, nuevoInvestigador, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al realizar la solicitud:', error);
          return throwError(error);
        })
      );
  }
  actualizarInvestigador(investigador: Investigador) {

    const url = `${this.apiUrl}/${investigador.numerodocumento}`;
  
    return this.http.put(url, investigador).pipe(
  
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

}