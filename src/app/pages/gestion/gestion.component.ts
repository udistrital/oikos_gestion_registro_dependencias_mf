
import { AfterViewInit, Component, Input, ViewChild, signal} from '@angular/core';
import { BusquedaGestion } from './../../models/busquedaGestion.models'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditarDependenciaDialogComponent } from './components/editar-dependencia-dialog/editar-dependencia-dialog.component'

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})


export class GestionComponent implements AfterViewInit{
  @Input('normalform') normalform: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  
  tiposDependencia = signal<string[]>([]);

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
    public dialog: MatDialog,
  ){
    this.cargarTiposDependencia();
    this.datos = new MatTableDataSource(this.elementosBusqueda())
  }
  
  ngAfterViewInit(){
    this.datos.paginator = this.paginator;
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

  abrirDialogEditarDependencia(){
    console.log("lo intenta")
    const dialogRef = this.dialog.open(EditarDependenciaDialogComponent, {
      width: '70%',
      height: 'auto',
      maxHeight: '65vh',
    });
  }

}
