import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {

    apiUrl = 'http://localhost:8000/custom-token-auth/';

    constructor(private http: HttpClient,private router: Router) { }

    login(correo: string, contrasena: string): Observable<any> {
        const body = {
          correo: correo,
          contrasena: contrasena
        };
    
        return this.http.post<any>(this.apiUrl, body);
      }
    
      // Método para guardar los datos del perfil del usuario en el LocalStorage
      guardarDatosUsuario(userData: any): void {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    
      // Método para obtener los datos del perfil del usuario almacenados en el LocalStorage
      obtenerDatosUsuario(): any {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      }
     
      logout(): void {
        // Eliminar los datos del usuario del LocalStorage
        localStorage.removeItem('userData');
        // Redireccionar al usuario a la página de inicio de sesión u otra página deseada.
        this.router.navigate(['/menu']);
      }

      isLoggedIn(): boolean {
        // Verifica si hay algún dato de usuario en el almacenamiento local
        // o algún otro criterio para determinar si el usuario está autenticado
        return localStorage.getItem('userData') !== null;
      }
}
