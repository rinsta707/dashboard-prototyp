import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemConfigurationComponent} from "./components/system-configuration/system-configuration.component";
import {AvailableServicesComponent} from "./components/available-services/available-services.component";
import {HclApplication, HclNavigationService} from "@hacon/hcl";
import {ProvisioningOptionsComponent} from "./components/provisioning-options/provisioning-options.component";
import { MessagesComponent } from './components/messages/messages.component';

const systemConfig: HclApplication = [
  {
    path: '',
    hidden: true,
    component: SystemConfigurationComponent,
    data: {
      titleSelector: 'system-configuration',
      requiredRole: ['ROLE_SYSTEM_ADMIN']
    }
  },
  {
    path: 'services',
    component: AvailableServicesComponent,
    data: {
      titleSelector: 'available-services',
      requiredRole: ['ROLE_SYSTEM_ADMIN']
    }
  },
  {
    path: 'provisioning',
    component: ProvisioningOptionsComponent,
    data: {
      titleSelector: 'provisioning-options',
      requiredRole: ['ROLE_SYSTEM_ADMIN']
    }
  },
  {
    path: 'messages',
    component: MessagesComponent,
    data: {
      titleSelector: 'messages',
      requiredRole: ['ROLE_SYSTEM_ADMIN']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(systemConfig)],
  exports: [RouterModule]
})
export class SystemConfigurationRoutingModule {

  constructor(navi: HclNavigationService) {
    navi.injectSubRoutes('/system-configuration', systemConfig);
  }

}
