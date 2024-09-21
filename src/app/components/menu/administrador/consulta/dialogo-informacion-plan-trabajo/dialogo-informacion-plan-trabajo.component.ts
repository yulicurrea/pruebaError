import { AfterViewInit, Component, ViewChild, Inject, OnInit, } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import { PlanTableData,MostrarPlan } from '../../../modelo/planDeTrabajo';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-informacion-plan-trabajo',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './dialogo-informacion-plan-trabajo.component.html',
  styleUrls: ['./dialogo-informacion-plan-trabajo.component.css']
})
export class DialogoInformacionPlanTrabajoComponent implements AfterViewInit,OnInit  {
  
  displayedColumns: string[] = [
    'name', 'weight', 'symbol', 'estricto', 'codigo', 'tituloProyecto',
    'tipoProducto', 'rol', 'tituloProducto', 'categoria', 'quartil', 'estado', 'avance'
  ];
  dataSource: MatTableDataSource<PlanTableData> = new MatTableDataSource<PlanTableData>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private planTrabajoService: ProyectoyproductoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.planTrabajoService.getPlanTrabajo().subscribe((allPlans: MostrarPlan[]) => {
      // Filtra el plan de trabajo específico usando el ID
      const selectedPlan = allPlans.find(plan => plan.id === this.data.planTrabajoId);
      
      if (selectedPlan) {
        const transformedData = this.transformData(selectedPlan);
        this.dataSource.data = transformedData;
      } else {
        console.error('Plan de trabajo no encontrado');
        this.dataSource.data = [];
      }
    });
  }
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  transformData(plan: MostrarPlan): PlanTableData[] {
    return plan.planTrabajo.map(pt => {
      const productos_asociados = pt.proyecto.productos_asociados || {};
      const minciencias = productos_asociados.minciencias || {};
      const quartil = productos_asociados.quartil || {};
  
      return {
        id: this.data.planTrabajoId,
        name: pt.investigador.Grupoinvestigacion ? pt.investigador.Grupoinvestigacion.nombre : '',
        weight: `${pt.investigador.nombre || ''} ${pt.investigador.apellidos || ''}`,
        symbol: typeof pt.investigador.horas_formacion === 'string' 
                  ? Number(pt.investigador.horas_formacion) 
                  : pt.investigador.horas_formacion || 0,
        estricto: typeof pt.horasestricto === 'string' 
                  ? Number(pt.horasestricto) 
                  : pt.horasestricto || 0,
        codigo: pt.proyecto.codigo || '',
        tituloProyecto: pt.proyecto.titulo || '',
        tipoProducto: productos_asociados.tipo_producto || '',  // Asignar el valor de tipo_producto
        rol: pt.rol || '',
        tituloProducto: productos_asociados.titulo_producto || '',
        categoria: minciencias.categoria || '',
        quartil: quartil.cuartil || '',
        estado: productos_asociados.estado_inicio_semestre || '',
        avance: typeof pt.proyecto.porcentaje_final_semestre === 'string'
                  ? Number(pt.proyecto.porcentaje_final_semestre)
                  : pt.proyecto.porcentaje_final_semestre || 0
      };
    });
}

  
}