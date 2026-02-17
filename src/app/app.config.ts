import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';

import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/guards/auth-interceptor.guard';
import { AuthenticationService } from './core/services/auth-service/authentication.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false
        }
      }
    }),


    //  HttpClient + interceptores de DI
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
    // inicializa usuario al recargar
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthenticationService) => () =>
        auth.initUserFromStorage(),
      deps: [AuthenticationService],
      multi: true
    },

    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ]
};
