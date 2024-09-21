import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError,tap  } from 'rxjs';
import { Investigador, Investigadores } from '../modelo/investigador';
import { Person } from '../modelo/person';
import { AutenticacionService } from './autenticacion';

@Injectable({
  providedIn: 'root' // Asegúrate de tener este providedIn en tu servicio
})
export class InvestigadorService {
  private apiUrl = 'http://localhost:8000/investigador'; 
  private apiUrl2 = 'http://localhost:8000/grupoinvestigacion'; 
  private apiUrl3 = 'http://localhost:8000/mostrarInvestigador'; 
  private apiNotificaciones = 'http://localhost:8000/notificaciones'; 
  private url = 'http://localhost:8000/ActualizarInvestigador';

  constructor(private http: HttpClient, private AutenticacionService:AutenticacionService) { }

  // mostrar la informacion de todos los investigadores
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  //mostrar grupos
  getgrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}`);
  }
  getUsuarioDetail(documento:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${documento}`);
  }
  
  private mostrarPyP = 'http://localhost:8000/mostrarPyP';
  getmostrarPyP(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.mostrarPyP}`).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }
  
  
  //Crear pregrado
  private apiPregrado = 'http://localhost:8000/pregrado';
  crearPregrado(data: any): Observable<any> {
    return this.http.post<any>(this.apiPregrado, data);
  }
  obtenerPregrado(): Observable<any> {
    return this.http.get<any[]>(this.apiPregrado);
  }

  //Crear posgrado
  private apiPosgrado = 'http://localhost:8000/posgrado';
  crearPosgrado(data: any): Observable<any> {
    return this.http.post<any>(this.apiPosgrado, data);
  }
  obtenerPosgrado(): Observable<any> {
    return this.http.get<any[]>(this.apiPosgrado);
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiNotificaciones}`);
  }

  leerNotificacion(notifica: any): Observable<void> {
    if (!notifica || !notifica.id) {
      return throwError('ID de notificación no válido');
    }
    const url = `${this.apiNotificaciones}/${notifica.id}`;
    console.log('Enviando solicitud PUT a:', url);
    console.log('Datos de la notificación:', notifica);
    return this.http.put<void>(url, notifica).pipe(
      tap(() => {
        console.log('Notificación marcada como leída');
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              return throwError('Investigador no encontrado');
            case 400:
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
  
  

  actualizarInvestigador(investigador: Investigadores) {
    const url = `${this.url}`;
    const formData = new FormData();

    // Append form fields to formData
    Object.keys(investigador).forEach(key => {
      const investigadorKey = key as keyof Investigador; // Convertir key a una clave válida de Investigador
      if (investigador[investigadorKey] !== undefined && investigador[investigadorKey] !== null) {
        formData.append(key, investigador[investigadorKey] as any);
      }
    });

    // Append the image file to formData if it exists
    if (investigador.imagen) {
      formData.append('imagen', investigador.imagen);
    }

    return this.http.put(url, formData).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 404:
              return throwError('Investigador no encontrado');
            case 400:
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