import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {HclComponentsModule} from "../../hcl-components.module";


@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
    imports: [
        CommonModule,
        HclComponentsModule
    ]
})
export class LoginModule { }
