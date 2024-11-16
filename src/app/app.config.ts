import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([apiInterceptor, authInterceptor])
    ),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     lang: 'en',
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '457907162948-jd8q4oor9emssp706ksh7ng3kneqbis8.apps.googleusercontent.com'
    //         ),
    //       },
    //     ],
    //     onError: (error) => {
    //       console.error(error);
    //     },
    //   } as SocialAuthServiceConfig,
    // },
  ],
};
