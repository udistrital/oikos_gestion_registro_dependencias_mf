import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})



export class RegistroComponent {
  @Input('normalform') normalform: any;

  tiposDependencia = signal<string[]>([]);
  dependenciasAsociadas = signal<string[]>([])
  tipoSeleccionado: any;

  constructor(){
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

}
