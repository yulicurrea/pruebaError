import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../services/autenticacion';
import { InvestigadorService} from "../../services/registroInvestigador";

@Component({
  selector: 'app-perfil-administrador',
  templateUrl: './perfil-administrador.component.html',
  styleUrls: ['./perfil-administrador.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule ,CommonModule],
})
export class PerfilAdministradorComponent  implements OnInit {
  userData: any;

  constructor(private autenticacionService: AutenticacionService, private investigadorService: InvestigadorService) { }

  ngOnInit(): void {
    this.userData = this.autenticacionService.obtenerDatosUsuario();
    
  }

  imagenURL: string = 'https://i.pinimg.com/originals/67/32/52/673252bd4db4eff03c2a07e5c4d60692.jpg'; // URL de tu imagen

  // Asignando la URL de la imagen a la variable urlDeLaImagen
  urlDeLaImagen: string = this.imagenURL;

  
  // activar y inactivar input
  
  inputDeshabilitado: boolean = true;


  activarInput() {
    this.inputDeshabilitado = false; // Activar el input
  }

  desactivarInput() {
    this.inputDeshabilitado = true; // Desactivar el input
  }

 guardarDatos() {
  console.log('Número de documento:', this.userData.numerodocumento); // Verificar el valor de numerodocumento
  this.investigadorService.actualizarInvestigador(this.userData).subscribe(
    (response) => {
      console.log('Datos de usuario actualizados con éxito:', response);
      // Aquí puedes agregar cualquier lógica adicional después de actualizar los datos, como mostrar un mensaje de éxito, etc.
    },
    (error) => {
      console.error('Error al actualizar los datos del usuario:', error);
      // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario, etc.
      // Por ejemplo:
      alert('Error al actualizar los datos del usuario. Por favor, inténtalo de nuevo.');
    }
  );
}

    }
