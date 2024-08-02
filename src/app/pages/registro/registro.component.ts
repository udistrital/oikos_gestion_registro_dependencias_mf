import { Component, Input, signal } from '@angular/core';
import { OikosService } from '../../services/oikos.service'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})



export class RegistroComponent {
  @Input('normalform') normalform: any;

  tiposDependencia: string[] = [];
  dependenciasAsociadas: string[] = [];
  tipoSeleccionado: any;
  respuesta: any;

  constructor(
    private oikosService: OikosService,
  ){
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
  }

  cargarTiposDependencia(){
    this.oikosService.get('tipo_dependencia').subscribe((res:any)=>{
      console.log(res);
      this.tiposDependencia = res.map((item:any) => item.Nombre);
    })
  }

  cargarDependenciasAsociadas(){
    this.oikosService.get('dependencia?query=Activo:true&limit=-1').subscribe((res:any)=>{
      console.log(res);
      this.dependenciasAsociadas = res.map((item:any) => item.Nombre);
    })
  }


}
