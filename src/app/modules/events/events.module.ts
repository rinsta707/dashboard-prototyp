import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventsComponent} from "./components/events/events.component";
import {EventsRoutingModule} from "./events-routing.module";
import { FormsModule } from '@angular/forms';
import { HclComponentsModule } from 'src/app/hcl-components.module';
import { EventsFilterPanelComponent } from './components/events-filter-panel/events-filter-panel.component';


@NgModule({
  declarations: [
    EventsComponent,
    EventsFilterPanelComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    HclComponentsModule,
    FormsModule
  ]
})
export class EventsModule { }
