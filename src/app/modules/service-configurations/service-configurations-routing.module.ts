import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ServiceConfigurationsComponent} from "./components/service-configurations/service-configurations.component";

const routes: Routes = [
  {
    path: '',
    component: ServiceConfigurationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceConfigurationsRoutingModule { }
