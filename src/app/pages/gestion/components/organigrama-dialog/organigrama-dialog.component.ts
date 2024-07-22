import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';


@Component({
  selector: 'app-organigrama-dialog',
  templateUrl: './organigrama-dialog.component.html',
  styleUrls: ['./organigrama-dialog.component.css']
})
export class OrganigramaDialogComponent implements OnInit{
  tipos_dependencia = [
    {
      tipo: ['CONTROL DISCIPLINARIO', 'GESTION DE EVALUACION Y CONTROL'],
      colores:{
        borde: {'border': '1px solid #8C1A18'},
        color_primario:{'background-color': '#f08080'},
        color_secundario:{ 'background-color': '#8C1A18'}
      }
    },
    {
      tipo: ["PLANEACION ESTRATEGICA E INSTITUCIONAL", "INTERINSTITUCIONIZACION E INTERNACIONALIZACION"],
      colores:{
        borde: {'border': '1px solid #ffdc7b'},
        color_primario:{'background-color': '#ffdc7b'},
        color_secundario:{ 'background-color': '#fec248'}
      }
    },
    {
      tipo: ["GESTION DE LOS SISTEMAS DE INFORMACION Y LAS TELECOMUNICACIONES","GESTION JURIDICA","SERVICIO AL CIUDADANO","GESTION DOCUMENTAL"],
      colores:{
        borde: {'border': '1px solid #80e7ed'},
        color_primario:{'background-color': '#80e7ed'},
        color_secundario:{ 'background-color': '#64d0da'}
      }
    }
  ]

  dependencias = [
    {
      dependencia: "Consejo Superior Universitario",
      tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL",
      hijos:[
        {
          dependencia:"Consejo Academico",
          tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL"
        },
        {
          dependencia:"Consejo Participacion Universitaria",
          tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL"
        },
        {
          dependencia:"Consejo Gestión Institucional",
          tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL"
        },
        {
          dependencia:"Rectoria",
          tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL",
          hijos:[
            {
              dependencia:"Oficina Control Interno",
              tipo: "GESTION DE EVALUACION Y CONTROL"
            },
            {
              dependencia:"Oficina Control Interno Disciplinario",
              tipo: "CONTROL DISCIPLINARIO"
            },
            {
              dependencia:"Oficina Asesora Planeacion",
              tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL"
            },
            {
              dependencia: "Oficina Asesora Tecnologías e Información",
              tipo: "GESTION DE LOS SISTEMAS DE INFORMACION Y LAS TELECOMUNICACIONES"
            },
            {
              dependencia: "Secretaria General",
              tipo: "PLANEACION ESTRATEGICA E INSTITUCIONAL",
              hijos:[
                {
                  dependencia: "Oficina Asesora Juridica",
                  tipo: "GESTION JURIDICA"
                },
                {
                  dependencia:"Programa Quejas, Reclamos y Atención al Ciudadano",
                  tipo: "SERVICIO AL CIUDADANO"
                },
                {
                  dependencia:"Proyecto Actas, Archivo y Microfilmacion",
                  tipo: "GESTION DOCUMENTAL"
                }
              ]
            },
            {
              dependencia:"Programa Relaciones Internacionales e Interinstitucionales",
              tipo:"INTERINSTITUCIONIZACION E INTERNACIONALIZACION"
            }
          ]
        }
      ]
    }
  ]

  data: TreeNode[]=[];
  constructor( public dialogRef: MatDialogRef<OrganigramaDialogComponent>){

  }

  ngOnInit(): void {
    this.data = this.crear_arbol(this.dependencias);
  }

  onCloseClick(){
    this.dialogRef.close();
  }
  
  crear_arbol(dependencias: any[]): TreeNode[]{
    return dependencias.map(dep =>{
      let tipo_depencia_asociado = this.getTipoDependencia(dep.tipo)
      return {
        expanded: true,
        type: "person",
        styleClass: "nodo",
        data:{
          nombre: dep.dependencia,
          ...tipo_depencia_asociado
        },
        children: dep.hijos ? this.crear_arbol(dep.hijos):[]
      };
    })
  }

  getTipoDependencia(tipo: string): any {
    for (let item of this.tipos_dependencia) {
      if (item.tipo.includes(tipo)) {
        return item.colores;
      }
    }
    return {};
  }
}


// {
//   expanded: true,
//   type: 'person',
//   styleClass: 'nodo',
//   data:{
//     nombre:'Oficinia Control Interno',
//     borde: this.tipos_dependencia.colores.borde,
//     color_primario: this.tipos_dependencia.colores.color_primario,
//     color_secundario: this.tipos_dependencia.colores.color_secundario
//   },
//   children: [
//       {
//         expanded: true,
//         type: 'person',
//         styleClass: 'nodo',
//         style: {'border': '1px solid #aad65f'},
//         data:{
//           nombre:'F.C Barcelona',
//           borde: this.tipos_dependencia.colores.borde,
//           color_primario:{'background-color': '#aad65f'},
//           color_secundario:{ 'background-color': '#8cbc44'}
//         },
//           children: [
//               {
//                 type: 'person',
//                 styleClass: 'nodo',
//                 style: {'background-color': 'green', },
//                 data:{
//                   nombre:'F.C Barcelona 2',
//                   borde: this.tipos_dependencia.colores.borde,
//                   color_primario:{'background-color': '#f08080'},
//                   color_secundario:{ 'background-color': '#8C1A18'}
//                 },
//               },