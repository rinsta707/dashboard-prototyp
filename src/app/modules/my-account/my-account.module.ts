import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { MyAccountRoutingModule } from "./my-account-routing.module";
import { HclComponentsModule } from 'src/app/hcl-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ChangePasswordModalComponent } from './components/my-account/dialogs/change-password-modal/change-password-modal.component';


@NgModule({
  declarations: [
    MyAccountComponent,
    ChangePasswordModalComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    HclComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MyAccountModule {}
