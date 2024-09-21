import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante, ParticipanteExterno } from '../modelo/proyectos';

@Injectable({
  providedIn: 'root' 
})

export class ParticipantesExternosService {
  
  constructor(private http: HttpClient) { }

  private apiParticipanteExterno = 'https://prueba-error-back1.vercel.app/participantesExternos';

  getParticipantesExternos(): Observable<ParticipanteExterno[]> {
      return this.http.get<any>(`${this.apiParticipanteExterno}`);
  }

  crearParticipantesExternos(proyecto: Estudiante): Observable<ParticipanteExterno> {
      return this.http.post<ParticipanteExterno>(this.apiParticipanteExterno, proyecto);
  }
}