import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SystemConfigurationComponent} from "./components/system-configuration/system-configuration.component";
import {SystemConfigurationRoutingModule} from "./system-configuration-routing.module";
import {AvailableServicesComponent} from "./components/available-services/available-services.component";
import {OptionRippleComponent} from "./components/option-ripple/option-ripple.component";
import {HclComponentsModule} from "../../hcl-components.module";
import {
  AvailableServicesViewModalComponent
} from "./components/available-services/dialogs/available-services-view-modal/available-services-view-modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AvailableServicesAddModalComponent } from './components/available-services/dialogs/available-services-add-modal/available-services-add-modal.component';
import { AvailableServicesAddStandardModalComponent } from './components/available-services/dialogs/available-services-add-standard-modal/available-services-add-standard-modal.component';
import { AvailableServicesRemoveModalComponent } from './components/available-services/dialogs/available-services-remove-modal/available-services-remove-modal.component';
import { AvailableServicesEditModalComponent } from './components/available-services/dialogs/available-services-edit-modal/available-services-edit-modal.component';
import { ProvisioningOptionsComponent } from './components/provisioning-options/provisioning-options.component';
import { ProvisioningOptionsAddStandardModalComponent } from './components/provisioning-options/dialogs/provisioning-options-add-standard-modal/provisioning-options-add-standard-modal.component';
import { ProvisioningOptionsViewModalComponent } from './components/provisioning-options/dialogs/provisioning-options-view-modal/provisioning-options-view-modal.component';
import { ProvisioningOptionsRemoveModalComponent } from './components/provisioning-options/dialogs/provisioning-options-remove-modal/provisioning-options-remove-modal.component';
import { ProvisioningRestrictionsComponent } from './components/provisioning-options/provisioning-restrictions/provisioning-restrictions.component';
import { ProvisioningRestrictionAddModalComponent } from './components/provisioning-options/provisioning-restrictions/dialogs/provisioning-restriction-add-modal/provisioning-restriction-add-modal.component';
import { ProvisioningRestrictionEditModalComponent } from './components/provisioning-options/provisioning-restrictions/dialogs/provisioning-restriction-edit-modal/provisioning-restriction-edit-modal.component';
import { ProvisioningRestrictionViewModalComponent } from './components/provisioning-options/provisioning-restrictions/dialogs/provisioning-restriction-view-modal/provisioning-restriction-view-modal.component';
import { ProvisioningRestrictionRemoveModalComponent } from './components/provisioning-options/provisioning-restrictions/dialogs/provisioning-restriction-remove-modal/provisioning-restriction-remove-modal.component';
import { ProvisioningOptionsAddCustomModalComponent } from './components/provisioning-options/dialogs/provisioning-options-add-custom-modal/provisioning-options-add-custom-modal.component';
import { ProvisioningOptionsEditModalComponent } from './components/provisioning-options/dialogs/provisioning-options-edit-modal/provisioning-options-edit-modal.component';
import { MessagesComponent } from './components/messages/messages.component';
import { QuillEditorComponent } from "ngx-quill";
import { AddEmailModalComponent } from './components/messages/dialog/add-email-modal/add-email-modal.component';
import { UpdateEmailModalComponent } from './components/messages/dialog/update-email-modal/update-email-modal.component';
import { DeleteEmailModalComponent } from './components/messages/dialog/delete-email-modal/delete-email-modal.component';
import { SoftQuotaMessageComponent } from './components/messages/tabs/soft-quota-message/soft-quota-message.component';
import { EmailReceiversComponent } from './components/messages/tabs/email-receivers/email-receivers.component';
import { AddLocaleModalComponent } from './components/messages/dialog/add-locale-modal/add-locale-modal.component';
import { DeleteLocaleModalComponent } from './components/messages/dialog/delete-locale-modal/delete-locale-modal.component';
import { HardQuotaMessageComponent } from './components/messages/tabs/hard-quota-message/hard-quota-message.component';

@NgModule({
  declarations: [
    SystemConfigurationComponent,
    AvailableServicesComponent,
    OptionRippleComponent,
    AvailableServicesViewModalComponent,
    AvailableServicesAddModalComponent,
    AvailableServicesAddStandardModalComponent,
    AvailableServicesRemoveModalComponent,
    AvailableServicesEditModalComponent,
    ProvisioningOptionsComponent,
    ProvisioningOptionsAddStandardModalComponent,
    ProvisioningOptionsViewModalComponent,
    ProvisioningOptionsRemoveModalComponent,
    ProvisioningRestrictionsComponent,
    ProvisioningRestrictionAddModalComponent,
    ProvisioningRestrictionEditModalComponent,
    ProvisioningRestrictionViewModalComponent,
    ProvisioningRestrictionRemoveModalComponent,
    ProvisioningOptionsAddCustomModalComponent,
    ProvisioningOptionsEditModalComponent,
    MessagesComponent,
    AddEmailModalComponent,
    UpdateEmailModalComponent,
    DeleteEmailModalComponent,
    SoftQuotaMessageComponent,
    EmailReceiversComponent,
    HardQuotaMessageComponent,
    AddLocaleModalComponent,
    DeleteLocaleModalComponent
  ],
  imports: [
    CommonModule,
    HclComponentsModule,
    SystemConfigurationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillEditorComponent
  ]
})
export class SystemConfigurationModule { }
