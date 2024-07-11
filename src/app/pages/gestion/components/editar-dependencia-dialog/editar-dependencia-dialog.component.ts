import { Component, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-dependencia-dialog',
  templateUrl: './editar-dependencia-dialog.component.html',
  styleUrls: ['./editar-dependencia-dialog.component.css']
})
export class EditarDependenciaDialogComponent {
  tiposDependencia = signal<string[]>([]);
  dependenciasAsociadas = signal<string[]>([])
  tipoSeleccionado: any;

  constructor(
    public dialogRef: MatDialogRef<EditarDependenciaDialogComponent>
  ){
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
  }

  cargarTiposDependencia(){
    const tipos =[
      "OFICINA ASESORA",
      "DIVISIÓN",
      "SECRETARIA ACADEMICA",
      "CENTRO",
      "INSTITUTO",
      "LABORATORIO",
      "ASOSIACIÓN",
      "PREGRADO",
      "ENTIDAD",
      "UNIDAD EJECUTORA",
      "OFICINA",
      "COMITE"
    ]
    for (let i=0; i < tipos.length; i++){
      this.tiposDependencia().push(tipos[i])
    }
  }

  cargarDependenciasAsociadas(){
    const dependecias =[
      "VICERRECTORIA ACADEMICA",
      "SECRETARIA GENERAL",
      "OFICINA ASESORA DE ASUNTOS DISCIPLINARIOS",
      "OFICINA ASESORA DE PLANEACION Y CONTROL",
      "INGENIERIA EN TELEMATICA",
      "FACULTAD DE INGENIERIA",
      "ESPECIALIZACION EN INFORMATICA Y AUTOMATICA INDUSTRIAL",
      "FACULTAD DE CIENCIAS Y EDUCACION",
      "ESPECIALIZACION EN INGENIERIA DE SOFTWARE",
      "ESPECIALIZACION EN PROYECTOS INFORMATICOS",
      "DIVISION DE RECURSOS HUMANOS",
      "MAESTRIA EN CIENCIAS DE LA INFORMACION Y LAS COMUNICACIONES",
      "MAESTRIA EN INGENIERIA INDUSTRIAL",
      "INGENIERIA TOPOGRAFICA",
    ]
    for (let i=0; i < dependecias.length; i++){
      this.dependenciasAsociadas().push(dependecias[i])
    }
  }

  onCloseClick(){
    this.dialogRef.close();
  }
}
