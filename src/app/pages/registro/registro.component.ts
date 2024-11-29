import { Component, Input, OnInit } from '@angular/core';
import { OikosService } from '../../services/oikos.service';
import { OikosMidService } from '../../services/oikos_mid.service';
import { PopUpManager } from '../../managers/popUpManager'
import { FormControl, FormGroup, Validators,AbstractControl, ValidationErrors  } from '@angular/forms';
import { Desplegables } from 'src/app/models/desplegables.models';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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
    private router: Router,
    private oikosService: OikosService,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
    public dialogRef: MatDialogRef<RegistroComponent>,
    private translate: TranslateService,
  ){
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {})
    this.cargarTiposDependencia();
    this.cargarDependenciasAsociadas();
  }

  ngOnInit() {
    this.iniciarFormularioConsulta();
  }
  
  correoUdistritalValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const dominioPermitido = '@udistrital.edu.co';
    
    if (email && !email.endsWith(dominioPermitido)) {
      return { correoInvalido: true };
    }
    
    return null;
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
          Validators.required,
          this.correoUdistritalValidator
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
    this.popUpManager.showLoaderAlert(this.translate.instant('CARGA.REGISTRO'));
    const registro = this.construirObjetoRegistro();
    this.oikosMidService.post("gestion_dependencias_mid/RegistrarDependencia", registro).pipe(
      tap((res: any) => {
          if (res.Success) {
              Swal.close();
              this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.REGISTRAR'))
              this.router.navigate(['/gestion']);
              
          } else {
              Swal.close();
              this.popUpManager.showErrorAlert(this.translate.instant('ERROR.REGISTRAR'));
          }
      }),
      catchError((error) => {
          Swal.close();
          console.error('Error en la solicitud:', error);
          this.popUpManager.showErrorAlert(this.translate.instant('ERROR.REGISTRAR') + ": " + (error.message || 'Error desconocido'));
          return of(null); 
      })
  ).subscribe();
  }

}
