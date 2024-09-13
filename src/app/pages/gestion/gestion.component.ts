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
import { PopUpManager } from '../../managers/popUpManager'
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

  datos = new MatTableDataSource<BusquedaGestion>();

  constructor(
    private oikosService: OikosService,
    public dialog: MatDialog,
    private oikosMidService: OikosMidService,
    private popUpManager: PopUpManager,
  ) {
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

    if (this.gestionForm.value.estado !== '...') {
      busqueda.BusquedaEstado = {
        Estado: this.gestionForm.value.estado === "ACTIVO"
      };
    }

    return busqueda;
  }

  buscarDependencias() {
    const busqueda = this.construirBusqueda();  
    this.popUpManager.showLoaderAlert();
    this.mostrarTabla = false;  

    this.oikosMidService.post("gestion_dependencias_mid/BuscarDependencia", busqueda).pipe(
      tap((res: any) => {
        if (res && res.Data) {
          const datosTransformados = res.Data.map((item: any) => ({
            id: item.Dependencia.Id,
            nombre: item.Dependencia.Nombre,
            telefono: item.Dependencia.TelefonoDependencia,
            correo: item.Dependencia.CorreoElectronico,
            dependenciasAsociadas: {
              id: item.DependenciaAsociada.Id,          
              nombre: item.DependenciaAsociada.Nombre
            },
            tipoDependencia: item.TipoDependencia.map((tipo: any) => ({
              id: tipo.Id,          
              nombre: tipo.Nombre   
            })),
            estado: item.Estado ? 'ACTIVA' : 'NO ACTIVA',
          }));
          
          this.datos = new MatTableDataSource<BusquedaGestion>(datosTransformados);
          setTimeout(() => { this.datos.paginator = this.paginator; }, 1000);

          Swal.close();
          this.popUpManager.showSuccessAlert('Datos cargados con éxito');
          this.mostrarTabla = true;  
        } else {
          Swal.close();
          this.popUpManager.showErrorAlert('Error al buscar dependencias: Datos no disponibles');
          this.mostrarTabla = false;
        }
      }),
      catchError((error) => {
        Swal.close();
        this.popUpManager.showErrorAlert('Error al buscar dependencias: ' + (error.message || 'Error desconocido'));
        console.error('Error al buscar dependencias:', error);
        this.mostrarTabla = false;
        return of(null);  
      })
    ).subscribe();
}

  
}
