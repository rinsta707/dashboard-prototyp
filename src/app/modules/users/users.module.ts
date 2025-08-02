import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeleteUserModalComponent} from "./components/users/dialogs/delete-user-modal/delete-user-modal.component";
import {UsersComponent} from "./components/users/users.component";
import {ViewUserModalComponent} from "./components/users/dialogs/view-user-modal/view-user-modal.component";
import {AddUserModalComponent} from "./components/users/dialogs/add-user-modal/add-user-modal.component";
import {EditUserModalComponent} from "./components/users/dialogs/edit-user-modal/edit-user-modal.component";
import {HclComponentsModule} from "../../hcl-components.module";
import {ReactiveFormsModule} from "@angular/forms";
import {UsersRoutingModule} from "./users-routing.module";
import {HclTooltipDirective} from "@hacon/hcl";
import { UserStatusModalComponent } from './components/users/dialogs/status-user-modal/user-status-modal.component';

@NgModule({
  declarations: [
    UsersComponent,
    ViewUserModalComponent,
    AddUserModalComponent,
    EditUserModalComponent,
    DeleteUserModalComponent,
    UserStatusModalComponent
  ],
  imports: [
    CommonModule,
    HclComponentsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    HclTooltipDirective
  ]
})
export class UsersModule { }
