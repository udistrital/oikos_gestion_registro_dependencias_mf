import { Component, Input, signal } from '@angular/core';
import { OikosService } from '../../services/oikos.service';
import { OikosMidService } from '../../services/oikos_mid.service';
import { PopUpManager } from '../../managers/popUpManager'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Desplegables } from 'src/app/models/desplegables.models';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})



export class RegistroComponent {
  @Input('normalform') normalform: any;

  tiposDependencia: Desplegables[] = [];
  dependenciasAsociadas: Desplegables[] = [];
 
  registroForm = new FormGroup({
    nombre: new FormControl("",{
      nonNullable: false,
      validators:[
        Validators.required
      ]
    }),
    telefono: new FormControl("",{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
    correo: new FormControl("",{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
    tipoDependencia: new FormControl<Desplegables | null>(null,{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
    dependenciaAsociada: new FormControl<Desplegables | null>(null,{
      nonNullable:true,
      validators:[
        Validators.required
      ]
    }),
  })

  constructor(
    private oikosService: OikosService,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
    public dialogRef: MatDialogRef<RegistroComponent>,
  ){
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
  }

  cargarTiposDependencia(){
    this.oikosService.get('tipo_dependencia?limit=-1&query=Activo:true').subscribe((res:any)=>{
      this.tiposDependencia = res.map((item:any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
    })
  }

  cargarDependenciasAsociadas(){
    this.oikosService.get('dependencia?query=Activo:true&limit=-1').subscribe((res:any)=>{
      this.dependenciasAsociadas =res.map((item:any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
    })
  }

  construirObjetoRegistro(): any{
    return{
      Dependencia:{
        Nombre: this.registroForm.value.nombre,
        TelefonoDependencia: this.registroForm.value.telefono,
        CorreoElectronico: this.registroForm.value.correo
      },
      TipoDependenciaId: this.registroForm.value.tipoDependencia?.id,
      DependenciaAsociadaId: this.registroForm.value.dependenciaAsociada?.id
    }
  }


  enviarDependencia(){
    const registro = this.construirObjetoRegistro();
    this.oikosMidService.post("gestion_dependencias_mid/RegistrarDependencia", registro).pipe(
      tap((res: any) => {
          if (res.Success) {
              this.popUpManager.showSuccessAlert("Dependencia creada");
          } else {
              this.popUpManager.showErrorAlert("Error al crear la dependencia");
          }
      }),
      catchError((error) => {
          console.error('Error en la solicitud:', error);
          this.popUpManager.showErrorAlert("Error al crear la dependencia: " + (error.message || 'Error desconocido'));
          return of(null); 
      })
  ).subscribe();
  }

}
