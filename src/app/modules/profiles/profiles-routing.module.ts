import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProfilesComponent} from "./components/profiles/profiles.component";

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
