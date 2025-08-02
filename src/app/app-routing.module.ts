import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HclApplication } from "@hacon/hcl";

const routes: HclApplication = [
  
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    icon: 'mat::dashboard',
    data: {
      titleSelector: 'dashboard',
      
    },
  },
  {
    path: 'service-consumers',
    loadChildren: () => import('./modules/service-consumers/service-consumers.module').then(m => m.ServiceConsumersModule),
    icon: 'mat::contacts',
    data: {
      titleSelector: 'service-consumers',
      requiredRole: ['ROLE_SYSTEM_ADMIN', 'ROLE_ADMIN', 'ROLE_USER', 'ROLE_VIEWER']
    },
  },
  {
    path: 'events',
    loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule),

    icon: 'mat::announcement',
    data: {
      titleSelector: 'events',
    },
  },
  {
    path: 'profiles',
    loadChildren: () => import('./modules/profiles/profiles.module').then(m => m.ProfilesModule),

    icon: 'mat::recent_actors',
    data: {
      titleSelector: 'profiles',

    },
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),

    icon: 'mat::people',
    data: {
      titleSelector: 'users',

    },
  },
  {
    path: 'my-account',
    loadChildren: () => import('./modules/my-account/my-account.module').then(m => m.MyAccountModule),

    icon: 'mat::person',
    data: {
      titleSelector: 'my-account',

    },
  },
  {
    path: 'service-configuration',
    loadChildren: () => import('./modules/service-configurations/service-configurations.module').then(m => m.ServiceConfigurationsModule),
    icon: 'mat::settings',
    data: {
      titleSelector: 'service-configuration',

    },
  },
  {
    path: 'system-configuration',
    loadChildren: () => import('./modules/system-configuration/system-configuration.module').then(m => m.SystemConfigurationModule),

    icon: 'mat::build',
    data: {
      titleSelector: 'system-configuration',

    }
  },
  {
    path: 'system-logs',
    loadChildren: () => import('./modules/system-logs/system-logs.module').then(m => m.SystemLogsModule),

    icon: 'mat::content_copy',
    data: {
      titleSelector: 'system-logs',

    },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    hidden: true
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
