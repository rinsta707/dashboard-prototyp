import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceConfigurationsComponent} from "./components/service-configurations/service-configurations.component";
import {ServiceConfigurationsRoutingModule} from "./service-configurations-routing.module";

@NgModule({
  declarations: [
    ServiceConfigurationsComponent
  ],
  imports: [
    CommonModule,
    ServiceConfigurationsRoutingModule
  ]
})
export class ServiceConfigurationsModule { }
