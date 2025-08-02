import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SystemLogsComponent} from "./components/system-logs/system-logs.component";

const routes: Routes = [
  {
    path: '',
    component: SystemLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SystemLogsRoutingModule { }
