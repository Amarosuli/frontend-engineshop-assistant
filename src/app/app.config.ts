import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

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
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
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
        LogIn,
      })
    ),
  ],
};
