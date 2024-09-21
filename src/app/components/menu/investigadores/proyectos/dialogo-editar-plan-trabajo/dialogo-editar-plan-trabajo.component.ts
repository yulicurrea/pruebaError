import { AfterViewInit, Component, ViewChild, Inject, OnInit, } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import { PlanTableData,MostrarPlan,PlanDeTrabajo } from '../../../modelo/planDeTrabajo';
import { AutenticacionService } from '../../../services/autenticacion';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvestigadorService } from '../../../services/registroInvestigador';
@Component({
  selector: 'app-dialogo-editar-plan-trabajo',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSelectModule, FormsModule],
  templateUrl: './dialogo-editar-plan-trabajo.component.html',
  styleUrl: './dialogo-editar-plan-trabajo.component.css'
})
export class DialogoEditarPlanTrabajoComponent implements AfterViewInit,OnInit {

  displayedColumns: string[] = ['tituloProyecto', 'tituloProducto', 'rol', 'estricto'];
  dataSource: MatTableDataSource<PlanTableData> = new MatTableDataSource<PlanTableData>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private planTrabajoService: ProyectoyproductoService,
    private autenticacionService: AutenticacionService,
    private InvestigadorService :InvestigadorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {}
  

  ngOnInit() {
    this.planTrabajoService.getPlanTrabajo().subscribe((allPlans: MostrarPlan[]) => {
      const selectedPlan = allPlans.find(plan => plan.id === this.data.planTrabajoId);
      
      if (selectedPlan) {
        const transformedData = this.transformData(selectedPlan);
        this.dataSource.data = transformedData;
      } else {
        console.error('Plan de trabajo no encontrado');
        this.dataSource.data = [];
      }
    });
    this.obtenerUsuarios();

  }
  usuariosAdmin: any[] = [];
  obtenerUsuarios(){
    this.InvestigadorService.getUsuarios().subscribe((data) => {   
      const usersAdmin = data.filter(u => u.rolinvestigador === 'Administrador');
      usersAdmin.forEach(element => {
        this.usuariosAdmin.push(element.numerodocumento);
      });
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  transformData(plan: MostrarPlan): PlanTableData[] {
    const userData = this.autenticacionService.obtenerDatosUsuario();
    const investigadorId = userData ? userData.numerodocumento : null;

    // Verificar que plan.planTrabajo sea un array
    if (!Array.isArray(plan.planTrabajo)) {
        console.error('plan.planTrabajo no es un array o es undefined');
        return [];
    }

    return plan.planTrabajo
        .filter((pt: PlanDeTrabajo) => pt.investigador.numerodocumento === investigadorId)
        .map(pt => {
            const productos_asociados = pt.proyecto.productos_asociados || {};
            const minciencias = productos_asociados.minciencias || {};
            const quartil = productos_asociados.quartil || {};

            return {
                id: Number(pt.id), // Asegúrate de convertir el id a número si es necesario
                name: pt.investigador.Grupoinvestigacion ? pt.investigador.Grupoinvestigacion.nombre : '',
                weight: `${pt.investigador.nombre || ''} ${pt.investigador.apellidos || ''}`,
                symbol: pt.investigador.horas_formacion || 0,
                estricto: pt.horasestricto || 0,
                codigo: pt.proyecto.codigo || '',
                tituloProyecto: pt.proyecto.titulo || '',
                tipoProducto: productos_asociados.tipo_producto || '',
                rol: pt.rol || '',
                tituloProducto: productos_asociados.titulo_producto || '',
                categoria: minciencias.categoria || '',
                quartil: quartil.cuartil || '',
                estado: productos_asociados.estado_inicio_semestre || '',
                avance: pt.proyecto.porcentaje_final_semestre || 0
            };
        });
}


saveChanges() {
  // Asegúrate de que estás utilizando el ID del plan de trabajo correcto
  const planTrabajoActualizado = this.dataSource.data.map(row => ({
      id: row.id.toString(),  // Utiliza el ID de la fila actual
      rol: row.rol,
      horasestricto: row.estricto
  }));

  planTrabajoActualizado.forEach(planTrabajo => {
      // Agrega el console.log aquí para depurar el ID
      console.log('Actualizando plan de trabajo con ID:', planTrabajo.id);
      
      this.planTrabajoService.updatePlanTrabajo(planTrabajo).subscribe(
          response => {
              this.snackBar.open('Plan de trabajo actualizado exitosamente.', 'Cerrar', { duration: 3000 });
              this.notificar(
                `Actualización de Plan de Trabajo`,
                planTrabajo.id, // Remitente puede ser un valor estático o dinámico
                this.usuariosAdmin, // Reemplaza con destinatarios reales
                `El plan de trabajo con ID ${planTrabajo.id} ha sido actualizado con rol ${planTrabajo.rol} y horas estrictas ${planTrabajo.horasestricto}.`
              );
            
            },
          error => {
              console.error('Error al actualizar el plan de trabajo:', error);
              this.snackBar.open('Error al actualizar el plan de trabajo.', 'Cerrar', { duration: 3000 });
          }
      );
  });
} 
notificar(asunto:string,remitente:any,destinatario:string[],mensaje:string):void {
  destinatario.forEach(admin => {
    const notificacion = {
      asunto: asunto,
      remitente: remitente,
      destinatario: admin,
      mensaje: mensaje
    }
    this.planTrabajoService.notificar(notificacion).subscribe(
      (resp: any) => {
        console.log('Se ha registrado el proyecto exitosamente:', resp);
      },
      (error: any) => {
        console.error('Error al registrar el proyecto:', error);
      }
    );
  });
}

  
  

}
