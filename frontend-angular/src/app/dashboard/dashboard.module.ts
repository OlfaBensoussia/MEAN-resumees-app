import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SafePipeModule } from 'safe-pipe';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import {MatGridListModule} from '@angular/material/grid-list';
import { PostulerComponent } from './postuler/postuler.component';
import { ListCondidatComponent } from './list-condidat/list-condidat.component';
import { CondidatDetailsComponent } from './condidat-details/condidat-details.component';
import { EditCondidatComponent } from './edit-condidat/edit-condidat.component';


@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ] ,
  declarations: [
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    PostulerComponent,
    ListCondidatComponent,
    CondidatDetailsComponent,
    EditCondidatComponent
  ],
  imports: [
    ChartsModule,
    MatGridListModule,
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SafePipeModule,
    FormsModule,
  ]
})
export class DashboardModule { }
