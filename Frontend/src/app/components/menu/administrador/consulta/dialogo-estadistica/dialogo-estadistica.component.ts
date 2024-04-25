import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import Chart, { ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-dialogo-estadistica',
  standalone: true,
  templateUrl: './dialogo-estadistica.component.html',
  styleUrls: ['./dialogo-estadistica.component.css'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule,
  ],
})
export class DialogoEstadisticaComponent implements OnInit {

  type!: string;
  data!: any;
  detail!: boolean;
  public chartGeneral!: Chart;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      type: string,      
      data: any,
      detail: boolean,
    },
    private readonly dialogRef: MatDialogRef<DialogoEstadisticaComponent>
  ) { }

  ngOnInit(): void {
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;
    this.detail = this.dialogData.detail;

    if(this.detail) {
      this.obtenerGraficaDetalle();
    } else {
      this.obtenerGraficaGeneral();
    }
  }

  obtenerGraficaGeneral() {
    let labelData: string[] = [];
    switch(this.type) { 
      case 'Proyectos': {
        this.data.forEach((element: { estadoProyecto: any; }) => {
          labelData.push(element.estadoProyecto);
        });
        break; 
      } 
      case 'Productos': {
        this.data.forEach((element: { estadoProducto: any; }) => {
          labelData.push(element.estadoProducto);
        });
        break; 
      } 
      default: {        
        this.data.forEach((element: { estado: any; }) => {
          labelData.push(element.estado);
        });
        break; 
      } 
    } 
    const unique = this.unique(labelData);
    const labelCountData: any[] = [];
    unique.forEach(element => {
      labelCountData.push(Number(labelData.filter(a => a === element).length));
    });
    // datos
    const data = {
      labels: unique,
      datasets: [{
        label: ` Total ${this.type}`,
        data: labelCountData,
        hoverOffset: 4,
        tooltip: {
          callbacks: {
            label: function(context: { label: any; formattedValue: any; chart: { data: { datasets: { data: any; }[]; }; }; }) {
              let label = context.label;
              let value = context.formattedValue;
              if (!label){
                label = 'Unknown'
              }
              let sum = 0;
              let dataArr = context.chart.data.datasets[0].data;
              dataArr.map((data: any) => {
                sum += Number(data);
              });
              let percentage = (value * 100 / sum).toFixed(2) + '%';
              return ` ${label}: ${value} (${percentage})`;
            }
          }
        }
      }]
    };
    this.chartGeneral = new Chart("chartGeneral", {
      type: 'doughnut' as ChartType,
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Resumen '+this.type,
          },   
        },
      },
    })
  }

  obtenerGraficaDetalle() {
    let labelData: string[] = [];
    this.data.forEach((element: { estadoProceso: any; }) => {
      labelData.push(element.estadoProceso);
    });
    const unique = this.unique(labelData);
    const labelCountData: any[] = [];
    unique.forEach(element => {
      labelCountData.push(Number(labelData.filter(a => a === element).length));
    });
    // datos
    const data = {
      labels: unique,
      datasets: [{
        label: ` Total ${this.type}`,
        data: labelCountData,
        hoverOffset: 4,
        tooltip: {
          callbacks: {
            label: function(context: { label: any; formattedValue: any; chart: { data: { datasets: { data: any; }[]; }; }; }) {
              let label = context.label;
              let value = context.formattedValue;
              if (!label){
                label = 'Unknown'
              }
              let sum = 0;
              let dataArr = context.chart.data.datasets[0].data;
              dataArr.map((data: any) => {
                  sum += Number(data);
              });
              let percentage = (value * 100 / sum).toFixed(2) + '%';
              return ` ${label}: ${value} (${percentage})`;
            }
          }
        }
      }]
    };
    this.chartGeneral = new Chart("chartGeneral", {
      type: 'pie' as ChartType,
      data,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Estados por Procesos`
          }
        }
      }
    })
  }

  unique(arr:any): string[] {
    let result: any[] = [];
    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }
    return result;
  }

}
