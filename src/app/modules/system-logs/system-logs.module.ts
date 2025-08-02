import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SystemLogsComponent} from "./components/system-logs/system-logs.component";
import {SystemLogsRoutingModule} from "./system-logs.routing.module";
import {HclComponentsModule} from "../../hcl-components.module";
import {SystemLogsFilterPanelComponent} from "./components/system-logs-filter-panel/system-logs-filter-panel.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    SystemLogsComponent,
    SystemLogsFilterPanelComponent
  ],
  imports: [
    CommonModule,
    SystemLogsRoutingModule,
    HclComponentsModule,
    FormsModule
  ]
})
export class SystemLogsModule { }
