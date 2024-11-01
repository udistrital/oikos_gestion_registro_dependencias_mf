import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { OikosMidService } from '../../../../services/oikos_mid.service';
import { Organigrama } from 'src/app/models/Organigrama.models';
import { PopUpManager } from '../../../../managers/popUpManager'
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-organigrama-dialog',
  templateUrl: './organigrama-dialog.component.html',
  styleUrls: ['./organigrama-dialog.component.css']
})
export class OrganigramaDialogComponent implements OnInit {
  tipos_dependencia = [
    {
      tipo: ['ENTIDAD', 'POSGRADO'],
      colores: {
        borde: { 'border': '1px solid #8C1A18' },
        color_primario: { 'background-color': '#f08080' },
        color_secundario: { 'background-color': '#8C1A18' }
      }
    },
    {
      tipo: ["UNIDAD EJECUTORA", "VICERRECTORIA"],
      colores: {
        borde: { 'border': '1px solid #ffdc7b' },
        color_primario: { 'background-color': '#ffdc7b' },
        color_secundario: { 'background-color': '#fec248' }
      }
    },
    {
      tipo: ["DIVISIÓN", "FACULTAD", "PROYECTO CURRICULAR"],
      colores: {
        borde: { 'border': '1px solid #80e7ed' },
        color_primario: { 'background-color': '#80e7ed' },
        color_secundario: { 'background-color': '#64d0da' }
      }
    }
  ];

  dependencias: { [key: string]: Organigrama } = {};
  general: TreeNode[][] = []; 
  administrativo: TreeNode[][] = []; 
  academico: TreeNode[][] = []; 

  constructor(
    public dialogRef: MatDialogRef<OrganigramaDialogComponent>,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.cargar_arbol();
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  cargar_arbol() {
    this.popUpManager.showLoaderAlert(this.translate.instant('CARGA.BUSQUEDA'));
    this.oikosMidService.get("gestion_dependencias_mid/Organigramas").subscribe((res: any) => {
      this.dependencias = res.Data.General;
      for (let key in this.dependencias) {
        if (this.dependencias.hasOwnProperty(key)) {
          const organigrama = this.dependencias[key];
          const treeNodes = this.crear_arbol(organigrama);
          this.general.push(treeNodes);
        }
      }

      this.dependencias = res.Data.Academico;
      for (let key in this.dependencias) {
        if (this.dependencias.hasOwnProperty(key)) {
          const organigrama = this.dependencias[key];
          const treeNodes = this.crear_arbol(organigrama);
          this.academico.push(treeNodes);
        }
      }

      this.dependencias = res.Data.Administrativo;
      for (let key in this.dependencias) {
        if (this.dependencias.hasOwnProperty(key)) {
          const organigrama = this.dependencias[key];
          const treeNodes = this.crear_arbol(organigrama);
          this.administrativo.push(treeNodes);
        }
      }
      Swal.close();
      
      this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.BUSQUEDA'));
    }, (error) => {
      Swal.close();
      this.popUpManager.showErrorAlert(this.translate.instant('ERROR.ORGANIGRAMA'));
    });
}


  crear_arbol(dependencia: Organigrama): TreeNode[] {
    const tipo_dependencia_asociado = this.getTipoDependencia(dependencia.Tipo ? dependencia.Tipo[0] : '');
    const node: TreeNode = {
      expanded: true,
      type: "person",
      styleClass: "nodo",
      data: {
        nombre: dependencia.Dependencia.Nombre,
        ...tipo_dependencia_asociado
      },
      children: dependencia.Hijos ? this.crear_arbol_hijos(dependencia.Hijos) : []
    };
    return [node];
  }

  crear_arbol_hijos(hijos: Organigrama[]): TreeNode[] {
    return hijos.map(hijo => {
      return this.crear_arbol(hijo)[0]; 
    });
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
