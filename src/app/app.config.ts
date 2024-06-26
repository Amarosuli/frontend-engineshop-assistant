import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import {
	ArrowDown,
	ArrowUp,
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
	LayoutGrid,
	SlidersHorizontal,
	Plus,
	FilterX,
	ChevronRight,
	ChevronLeft
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
				ArrowUp,
				ArrowDown,
				LayoutGrid,
				FilterX,
				SlidersHorizontal,
				Plus,
				ChevronLeft,
				ChevronRight
			})
		)
	]
};
