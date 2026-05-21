import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HomeComponent } from './components/home/home.component';
import { DesignSystemComponent } from './components/design-system/design-system.component';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'design-system', component: DesignSystemComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations()
  ]
};
