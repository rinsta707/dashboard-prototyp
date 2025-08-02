import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import { IxModule } from '@siemens/ix-angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { FilterModalComponent } from './components/dashboard/filter/filter-modal/filter-modal.component';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    DashboardComponent,
    FilterModalComponent
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IxModule,
    NgxEchartsModule,
    ReactiveFormsModule,
  ],


})
export class DashboardModule { }
