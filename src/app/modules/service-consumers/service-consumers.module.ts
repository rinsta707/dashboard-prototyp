import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceConsumersComponent} from "./components/service-consumers/service-consumers.component";
import {ServiceConsumersRoutingModule} from "./service-consumers-routing.module";

@NgModule({
  declarations: [
    ServiceConsumersComponent
  ],
  imports: [
    CommonModule,
    ServiceConsumersRoutingModule
  ]
})
export class ServiceConsumersModule { }
