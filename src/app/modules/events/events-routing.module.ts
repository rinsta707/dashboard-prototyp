import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {EventsComponent} from "./components/events/events.component";

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
