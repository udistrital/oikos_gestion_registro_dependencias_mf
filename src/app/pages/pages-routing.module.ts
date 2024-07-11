import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { GestionComponent } from './gestion/gestion.component'


const routes: Routes = [{
  path: '',
  children:[
    {
      path: 'registro',
      component: RegistroComponent
    },
    {
      path: 'gestion',
      component: GestionComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
