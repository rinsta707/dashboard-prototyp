import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MyAccountComponent} from "./components/my-account/my-account.component";

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
