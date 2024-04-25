import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutenticacionService } from '../../services/autenticacion';
@Component({
  selector: 'app-perfil-investigador',
  templateUrl: './perfil-investigador.component.html',
  styleUrls: ['./perfil-investigador.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, CommonModule],
})
export class PerfilInvestigadorComponent implements OnInit {
  userData: any;

  constructor(private autenticacionService: AutenticacionService) { }

  ngOnInit(): void {
    this.userData = this.autenticacionService.obtenerDatosUsuario();
  }

  // imagen
  imagenURL: string = 'https://i.pinimg.com/originals/67/32/52/673252bd4db4eff03c2a07e5c4d60692.jpg'; // URL de tu imagen
  
  urlDeLaImagen: string = this.imagenURL;
  
  //Agregar nuevo input
  inputs: any[] = [];
  agregarInput() {
    this.inputs.push({
      tipo: '',
      titulo: '',
      fecha: '',
      lugar: ''
    });
  }

  inputsP: any[] = [];
  agregarInputPre() {
    this.inputsP.push({
      tipo: '',
      titulo: '',
      fecha: '',
      lugar: ''
    });
  }
  
  // activar y inactivar input
  mostrarNuevo: boolean = false
  mostrarInput: boolean = false;
  inputDeshabilitado: boolean = true;
  deshabilitarNuevosInputs: boolean = true;
  
  activarInput() {
    this.inputDeshabilitado = false;
    this.mostrarInput = true;
    this.mostrarNuevo = false;
  }

  desactivarInput() {
    this.inputDeshabilitado = true;
    this.mostrarInput = false;
    this.mostrarNuevo = true;
    this.deshabilitarNuevosInputs = true;
  }

  cancelarInput(){
    this.inputDeshabilitado = true;
    this.mostrarInput = false;
    this.mostrarNuevo = true;
    this.inputs = [];
    this.inputsP = []; // Reiniciar el array inputsP para eliminar los inputs creados
  }
}
