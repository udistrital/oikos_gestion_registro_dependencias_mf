import { AfterViewInit, Component, Input, OnInit, ViewChild, signal } from '@angular/core';
import { BusquedaGestion } from './../../models/busquedaGestion.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditarDependenciaDialogComponent } from './components/editar-dependencia-dialog/editar-dependencia-dialog.component';
import { OrganigramaDialogComponent } from './components/organigrama-dialog/organigrama-dialog.component';
import { OikosService } from '../../services/oikos.service';
import { OikosMidService } from '../../services/oikos_mid.service';
import { Desplegables } from 'src/app/models/desplegables.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopUpManager } from '../../managers/popUpManager';
import { catchError, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit, AfterViewInit {
  @Input('normalform') normalform: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  tiposDependencia: Desplegables[] = [];
  facultades: Desplegables[] = [];
  vicerrectorias: Desplegables[] = [];
  mostrarTabla: boolean = false;
  cargando: boolean = false;
  columnasBusqueda = signal<string[]>(["NOMBRE","DEPENDENCIA ASOCIADAS","TIPO","ESTADO","ACCIONES"]);
  gestionForm !:  FormGroup;

  elementosBusqueda = signal<BusquedaGestion[]>([])
  datos = new MatTableDataSource<BusquedaGestion>();

  constructor(
    private oikosService: OikosService,
    public dialog: MatDialog,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('es');
    this.cargarTiposDependencia();
    this.cargarFacultades();
    this.cargarVicerrectorias();
  }


  ngOnInit() {
    this.iniciarFormularioConsulta();
    this.gestionForm.get('facultad')?.valueChanges.subscribe((selectedFacultad) => {
      if (selectedFacultad) {
        this.gestionForm.get('vicerrectoria')?.setValue(null);
        this.gestionForm.get('tipoDependencia')?.setValue(null);
      }
    });
    this.gestionForm.get('vicerrectoria')?.valueChanges.subscribe((selectedVicerrectoria) => {
      if (selectedVicerrectoria) {
        this.gestionForm.get('facultad')?.setValue(null);
        this.gestionForm.get('tipoDependencia')?.setValue(null);
      }
    });
    this.gestionForm.get('tipoDependencia')?.valueChanges.subscribe((selectedTipoDependencia) => {
      if (selectedTipoDependencia) {
        this.gestionForm.get('facultad')?.setValue(null);
        this.gestionForm.get('vicerrectoria')?.setValue(null);
      }
    });
  }

  ngAfterViewInit() {
    this.datos.paginator = this.paginator;
  }

  iniciarFormularioConsulta(){
    this.gestionForm = new FormGroup({
      nombre: new FormControl("", {
        nonNullable: false,
        validators: [Validators.required]
      }),
      tipoDependencia: new FormControl<Desplegables | null>(null, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      facultad: new FormControl<Desplegables | null>(null, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      vicerrectoria: new FormControl<Desplegables | null>(null, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      estado: new FormControl<string | null>(null, {
        nonNullable: true,
        validators: [Validators.required]
      }),
    });
  }
  
  cargarTiposDependencia() {
    this.oikosService.get('tipo_dependencia?limit=-1&query=Activo:true').subscribe((res: any) => {
      this.tiposDependencia = res.map((item: any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
    });
  }

  cargarFacultades() {
    this.oikosService.get('dependencia?limit=-1').subscribe((res: any) => {
      this.facultades = res.filter((item: any) =>
        item.DependenciaTipoDependencia &&
        item.DependenciaTipoDependencia.some((tipoDependencia: any) =>
          tipoDependencia.TipoDependenciaId.Nombre === 'FACULTAD'
        )
      )
        .map((item: any) => ({
          id: item.Id,
          nombre: item.Nombre
        }));
    });
  }

  cargarVicerrectorias() {
    this.oikosService.get('dependencia?limit=-1').subscribe((res: any) => {
      this.vicerrectorias = res.filter((item: any) =>
        item.DependenciaTipoDependencia &&
        item.DependenciaTipoDependencia.some((tipoDependencia: any) =>
          tipoDependencia.TipoDependenciaId.Nombre === 'VICERRECTORIA'
        )
      )
        .map((item: any) => ({
          id: item.Id,
          nombre: item.Nombre
        }));
    });
  }

  abrirDialogEditarDependencia(element: any) {
    const dialogRef = this.dialog.open(EditarDependenciaDialogComponent, {
      width: '70%',
      height: 'auto',
      maxHeight: '65vh',
      data:element
    });

    dialogRef.componentInstance.dependenciaActualizada.subscribe(() => {
      const busqueda = this.construirBusqueda();
      this.busqueda(busqueda).then((resultados) => {
        this.procesarResultados(resultados);
      });
    });
  }

  abrirDialogOrganigrama() {
    const dialogRef = this.dialog.open(OrganigramaDialogComponent, {
      width: '80%',
      height: '90%',
    });
  }

  construirBusqueda() {
    const busqueda: any = {};

    if (this.gestionForm.value.nombre) {
      busqueda.NombreDependencia = this.gestionForm.value.nombre;
    }

    if (this.gestionForm.value.tipoDependencia?.id) {
      busqueda.TipoDependenciaId = this.gestionForm.value.tipoDependencia.id;
    }

    if (this.gestionForm.value.facultad?.id) {
      busqueda.FacultadId = this.gestionForm.value.facultad.id;
    }

    if (this.gestionForm.value.vicerrectoria?.id) {
      busqueda.VicerrectoriaId = this.gestionForm.value.vicerrectoria.id;
    }

    if (this.gestionForm.value.estado) {
      if ( this.gestionForm.value.estado != '...'){
        busqueda.BusquedaEstado = {
          Estado: this.gestionForm.value.estado === "ACTIVO"
        };
      }
    }
    return busqueda;
  }

  buscarDependencias() {
    const busqueda = this.construirBusqueda();
    if (Object.keys(busqueda).length !== 0) {
      this.busqueda(busqueda).then((resultadosParciales) => {
        this.procesarResultados(resultadosParciales);
      });
    } else {
      
      const busquedaActiva = {
        BusquedaEstado:{
          Estado: true
        }
      };
      const busquedaInactiva = {
        BusquedaEstado:{
          Estado: false
        }
      };
      this.busqueda(busquedaActiva).then((resultadosActivos) => {
      this.busqueda(busquedaInactiva).then((resultadosInactivos) => {
        const resultadosTotales = [...resultadosActivos, ...resultadosInactivos];
        this.procesarResultados(resultadosTotales);
      });
      });
    }
      
  }

  procesarResultados(resultados: any[]) {
    if (resultados.length > 0) {
      this.datos = new MatTableDataSource<BusquedaGestion>(resultados);
      setTimeout(() => { this.datos.paginator = this.paginator; }, 1000);
      this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.BUSQUEDA'));
      this.mostrarTabla = true;  
    } else {
      this.popUpManager.showErrorAlert(this.translate.instant('ERROR.BUSQUEDA.DATOS'));
      this.mostrarTabla = false;
    }
  }

  consultarDependencia(id: number): Promise<any> {
    return this.oikosService.get('dependencia/' + id).toPromise();
  }

  activarDependenciaComprobacion(element: any){
    this.popUpManager.showConfirmAlert(this.translate.instant('CONFIRMACION.ACTIVAR.PREGUNTA'),this.translate.instant('CONFIRMACION.ACTIVAR.CONFIRMAR'),this.translate.instant('CONFIRMACION.ACTIVAR.DENEGAR')).then((result) =>{
      if (result === true){
        this.activarDependencia(element)
      }
    })
  }

  desactivarDependenciaComprobacion(element: any){
    this.popUpManager.showConfirmAlert(this.translate.instant('CONFIRMACION.DESACTIVAR.PREGUNTA'),this.translate.instant('CONFIRMACION.DESACTIVAR.CONFIRMAR'),this.translate.instant('CONFIRMACION.DESACTIVAR.DENEGAR')).then((result) =>{
      if (result === true){
        this.desactivarDependencia(element)
      }
    })
  }

  async activarDependencia(element: any) {
    this.popUpManager.showLoaderAlert(this.translate.instant('CARGA.ACTIVAR'));
    const fechaActual = new Date().toISOString();

    try {
      const dataConsulta: any = await this.consultarDependencia(element.id);

      const dataActualizada = {
        "Id": dataConsulta.Id,
        "Nombre": dataConsulta.Nombre,
        "TelefonoDependencia": dataConsulta.TelefonoDependencia,
        "CorreoElectronico": dataConsulta.CorreoElectronico,
        "Activo": true,
        "FechaCreacion": dataConsulta.FechaCreacion,
        "FechaModificacion": fechaActual,
        "DependenciaTipoDependencia": element.tipoDependencia 
          ? element.tipoDependencia.map((tipo: any) => ({ "Id": tipo.id }))
          : []
      }

      const response: any = await this.oikosService.put("dependencia", dataActualizada).toPromise();
      if (response && response.Id === dataActualizada.Id && response.Activo === dataActualizada.Activo) {
        Swal.close();
        this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.ACTIVAR'));

        const busqueda = this.construirBusqueda();
        this.busqueda(busqueda).then((resultados) => {
          this.procesarResultados(resultados);
        });
      } else {
        Swal.close();
        this.popUpManager.showErrorAlert(this.translate.instant('ERROR.ACTIVAR'));
      }
    } catch (error) {
      Swal.close();
      this.popUpManager.showErrorAlert(this.translate.instant('ERROR.ACTIVAR') + ":" + this.translate.instant('ERROR.DESCONOCIDO'));
    }

  }

  async desactivarDependencia(element: any) {
    this.popUpManager.showLoaderAlert(this.translate.instant('CARGA.DESACTIVAR'));
    const fechaActual = new Date().toISOString();

    try {
      const dataConsulta: any = await this.consultarDependencia(element.id);

      const dataActualizada = {
        "Id": dataConsulta.Id,
        "Nombre": dataConsulta.Nombre,
        "TelefonoDependencia": dataConsulta.TelefonoDependencia,
        "CorreoElectronico": dataConsulta.CorreoElectronico,
        "Activo": false,
        "FechaCreacion": dataConsulta.FechaCreacion,
        "FechaModificacion": fechaActual,
        "DependenciaTipoDependencia": element.tipoDependencia?.map((tipo: any) => ({
          "Id": tipo.id
        }))
      }

      const response: any = await this.oikosService.put("dependencia", dataActualizada).toPromise();

      if (response && response.Id === dataActualizada.Id && response.Activo === dataActualizada.Activo) {
        this.popUpManager.showSuccessAlert(this.translate.instant('EXITO.DESACTIVAR'));

        const busqueda = this.construirBusqueda();
        this.busqueda(busqueda).then((resultados) => {
          this.procesarResultados(resultados);
        });
      } else {
        this.popUpManager.showErrorAlert(this.translate.instant('ERROR.DESACTIVAR'));
      }
    } catch (error) {
      this.popUpManager.showErrorAlert(this.translate.instant('ERROR.DESACTIVAR') + ":" + this.translate.instant('ERROR.DESCONOCIDO'));
    }
  }

  busqueda(busqueda: any = {}): Promise<any[]>{
    this.popUpManager.showLoaderAlert(this.translate.instant('CARGA.BUSQUEDA'));

    return this.oikosMidService.post("gestion_dependencias_mid/BuscarDependencia", busqueda).pipe(
      map((res: any) => {
        if (res && res.Data) {
          return res.Data.map((item: any) => ({
            id: item.Dependencia.Id,
            nombre: item.Dependencia.Nombre,
            telefono: item.Dependencia.TelefonoDependencia,
            correo: item.Dependencia.CorreoElectronico,
            dependenciasAsociadas: item.DependenciaAsociada ? {
              id: item.DependenciaAsociada.Id,
              nombre: item.DependenciaAsociada.Nombre
            }: null,
            tipoDependencia: item.TipoDependencia.map((tipo: any) => ({
              id: tipo.Id,
              nombre: tipo.Nombre
            })),
            estado: item.Estado ? 'ACTIVA' : 'NO ACTIVA',
          }));
        } else {
          return [];
        }
      }),
      catchError((error) => {
        Swal.close();
        this.popUpManager.showErrorAlert(this.translate.instant('ERROR.BUSQUEDA.BUSQUEDA') + (error.message || this.translate.instant('ERROR.DESCONOCIDO')));
        return []
      })
    ).toPromise() as Promise<any[]>;
  }
}
