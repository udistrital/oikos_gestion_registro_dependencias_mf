import { Component, Input, OnInit } from '@angular/core';
import { OikosService } from '../../services/oikos.service';
import { OikosMidService } from '../../services/oikos_mid.service';
import { PopUpManager } from '../../managers/popUpManager'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Desplegables } from 'src/app/models/desplegables.models';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})



export class RegistroComponent implements OnInit{
  @Input('normalform') normalform: any;

  tiposDependencia: Desplegables[] = [];
  dependenciasAsociadas: Desplegables[] = [];
  registroForm !: FormGroup;
  
  constructor(
    private oikosService: OikosService,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
    public dialogRef: MatDialogRef<RegistroComponent>,
    private translate: TranslateService,
  ){
    translate.setDefaultLang('es');
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
  }

  ngOnInit() {
    this.iniciarFormularioConsulta();
  }

  iniciarFormularioConsulta(){
    this.registroForm = new FormGroup({
      nombre: new FormControl<string | null>("",{
        nonNullable: false,
        validators:[
          Validators.required
        ]
      }),
      telefono: new FormControl<string | null>("",{
        nonNullable:true,
        validators:[
          Validators.required
        ]
      }),
      correo: new FormControl<string | null>("",{
        nonNullable:true,
        validators:[
          Validators.required
        ]
      }),
      tipoDependencia: new FormControl<Desplegables[] | null>([],{
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
    const formValues = this.registroForm.value;
    return{
      Dependencia:{
        Nombre: formValues.nombre,
        TelefonoDependencia: formValues.telefono,
        CorreoElectronico: formValues.correo
      },
      TipoDependenciaId: formValues.tipoDependencia?.map((tipo: Desplegables) => tipo.id) || [],
      DependenciaAsociadaId: formValues.dependenciaAsociada?.id
    }
  }


  enviarDependencia(){
    const registro = this.construirObjetoRegistro();
    console.log(registro)
    this.oikosMidService.post("gestion_dependencias_mid/RegistrarDependencia", registro).pipe(
      tap((res: any) => {
          if (res.Success) {
              this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.REGISTRAR'));
          } else {
              this.popUpManager.showErrorAlert(this.translate.instant('ERROR.REGISTRAR'));
          }
      }),
      catchError((error) => {
          console.error('Error en la solicitud:', error);
          this.popUpManager.showErrorAlert(this.translate.instant('ERROR.REGISTRAR') + ": " + (error.message || 'Error desconocido'));
          return of(null); 
      })
  ).subscribe();
  }

}
