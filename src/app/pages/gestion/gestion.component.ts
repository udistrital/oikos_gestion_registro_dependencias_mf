
import { AfterViewInit, Component, Input, ViewChild, signal} from '@angular/core';
import { BusquedaGestion } from './../../models/busquedaGestion.models'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditarDependenciaDialogComponent } from './components/editar-dependencia-dialog/editar-dependencia-dialog.component'
import { OrganigramaDialogComponent } from './components/organigrama-dialog/organigrama-dialog.component'
import { OikosService } from '../../services/oikos.service';
import { Desplegables } from 'src/app/models/desplegables.models';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})


export class GestionComponent implements AfterViewInit{
  @Input('normalform') normalform: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  
  tiposDependencia: Desplegables[] = [];
  facultades: Desplegables[] = [];
  vicerrectorias: Desplegables[] = [];

  columnasBusqueda = signal<string[]>(["NOMBRE","DEPENDENCIA ASOCIADAS","TIPO","ESTADO","ACCIONES"]);
  
  elementosBusqueda = signal<BusquedaGestion[]>([
    {
      nombre: "FACULTAD DE TEATRO",
      dependenciasAsociadas: "FACULTAD DE ARTES",
      tipoDependencia: ["DIVISION", "SESION"],
      estado: "ACTIVA"
    },
    {
      nombre: "FACULTAD DE MUSICA",
      dependenciasAsociadas: "FACULTAD DE ARTES",
      tipoDependencia: ["FACULTAD"],
      estado: "NO ACTIVA"
    },
    {
      nombre: "FACULTAD DE PINTURA",
      dependenciasAsociadas: "FACULTAD DE ARTES",
      tipoDependencia: ["COMITE", "OFICINA"],
      estado: "ACTIVA"
    },
    {
      nombre: "FACULTAD DE DANZA",
      dependenciasAsociadas: "FACULTAD DE ARTES",
      tipoDependencia: ["LABORATORIO"],
      estado: "NO ACTIVA"
    },
  ]);
  datos = new MatTableDataSource<BusquedaGestion>;
  
  

  constructor(
    private oikosService: OikosService,
    public dialog: MatDialog,
  ){
    this.cargarTiposDependencia();
    this.cargarFacultades();
    this.cargarVicerrectorias();
    this.datos = new MatTableDataSource(this.elementosBusqueda())
    
  }
  
  ngAfterViewInit(){
    this.datos.paginator = this.paginator;
  }

  
  cargarTiposDependencia(){
    this.oikosService.get('tipo_dependencia?limit=-1').subscribe((res:any)=>{
      this.tiposDependencia = res.map((item:any) => ({
        id: item.Id,
        nombre: item.Nombre
      }));
    })
  }

  cargarFacultades(){
    this.oikosService.get('dependencia?limit=-1').subscribe((res: any) => {
      this.facultades = res.filter((item: any) => 
          item.DependenciaTipoDependencia && 
          item.DependenciaTipoDependencia.some((tipoDependencia: any) => 
            tipoDependencia.TipoDependenciaId.Nombre === 'FACULTAD'
          )
        )
        .map((item: any) =>({
          id: item.Id,
          nombre: item.Nombre
        }));
    });
  }

  cargarVicerrectorias(){
    this.oikosService.get('dependencia?limit=-1').subscribe((res: any) => {
      this.vicerrectorias = res.filter((item: any) => 
          item.DependenciaTipoDependencia && 
          item.DependenciaTipoDependencia.some((tipoDependencia: any) => 
            tipoDependencia.TipoDependenciaId.Nombre === 'VICERRECTORIA'
          )
        )
        .map((item: any) =>({
          id: item.Id,
          nombre: item.Nombre
        }));
    });
  }

  abrirDialogEditarDependencia(){
    const dialogRef = this.dialog.open(EditarDependenciaDialogComponent, {
      width: '70%',
      height: 'auto',
      maxHeight: '65vh',
    });
  }

  abrirDialogOrganigrama(){
    console.log("lo intenta")
    const dialogRef = this.dialog.open(OrganigramaDialogComponent, {
      width: '80%',
      height: '90%',
    });
  }



}
