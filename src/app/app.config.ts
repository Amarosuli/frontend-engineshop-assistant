import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  DatabaseZap,
  FileCog,
  FlaskRound,
  LogIn,
  LucideAngularModule,
  Map,
  MonitorDot,
  PackageCheck,
  TableProperties,
  Workflow,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Map,
        FileCog,
        Workflow,
        FlaskRound,
        MonitorDot,
        DatabaseZap,
        PackageCheck,
        TableProperties,
        LogIn
      })
    ),
  ],
};
