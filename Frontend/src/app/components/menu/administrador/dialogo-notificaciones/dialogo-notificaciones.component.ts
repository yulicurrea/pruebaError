import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dialogo-notificaciones',
  standalone: true,
  templateUrl: './dialogo-notificaciones.component.html',
  styleUrls: ['./dialogo-notificaciones.component.css'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgFor,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
  ],
})
export class DialogoNotificacionesComponent implements OnInit {
  displayedColumns: string[] = ['asunto', 'mensaje', 'remitente', 'created_at'];
  dataSource: MatTableDataSource<any>;

  buttonTitle!: string;
  title!: string;
  data!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      data: any,
    },
    private readonly dialogRef: MatDialogRef<DialogoNotificacionesComponent>
  ) { 
    this.dataSource = new MatTableDataSource<any>([]);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.data = this.dialogData.data;
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
