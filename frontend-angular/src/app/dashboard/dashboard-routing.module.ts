import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from "src/app/authentication/guards/authentication/authentication.guard";
import { LevelGuard } from "src/app/authentication/guards/levels/level.guard";
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { PostulerComponent } from './postuler/postuler.component';
import { ListCondidatComponent } from './list-condidat/list-condidat.component';
import { CondidatDetailsComponent } from './condidat-details/condidat-details.component';
import { EditCondidatComponent } from './edit-condidat/edit-condidat.component';

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children : [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'postuler',
        component: PostulerComponent,
      },
      {
        path: 'listeCondidats',
        component: ListCondidatComponent,
        canActivate: [AuthenticationGuard],
        data: {
          routeAuthorization: 'route.dashboard.listeCondidats'
        }
      },
      {
        path: 'condidatDetails/:id',
        component: CondidatDetailsComponent,
        canActivate: [AuthenticationGuard],
        data: {
          routeAuthorization: 'route.dashboard.condidatDetails'
        }
      },
      {
        path: 'editCondidat/:id',
        component: EditCondidatComponent,
        canActivate: [AuthenticationGuard],
        data: {
          routeAuthorization: 'route.dashboard.editCondidat'
        }
      },

    ],
    data: {
      routeAuthorization: 'route.dashboard'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
