import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { GestionComponent } from './pages/gestion/gestion.component';
import { AuthGuard } from 'src/_guards/auth.guard';

const routes: Routes = [
  {
    path: "registro",
    canActivate: [AuthGuard],
    component: RegistroComponent
  },
  {
    path: "gestion",
    canActivate: [AuthGuard],
    component: GestionComponent
  },
  {
    path: "**",
    redirectTo: "registro"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/"}]
})
export class AppRoutingModule { }
