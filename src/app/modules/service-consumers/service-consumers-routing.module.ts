import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ServiceConsumersComponent} from "./components/service-consumers/service-consumers.component";

const routes: Routes = [
  {
    path: '',
    component: ServiceConsumersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ServiceConsumersRoutingModule { }
