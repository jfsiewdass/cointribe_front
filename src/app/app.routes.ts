import { Router, Routes } from '@angular/router';
import { FullComponent } from './core/layouts/full/full.component';
import { BlankComponent } from './core/layouts/blank/blank.component';
import { inject } from '@angular/core';
import { TokenService } from './core/services/token.service';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [() => {
          if (inject(TokenService).isLogged())  return true;
          else {
            inject(Router).navigate(['/auth/login']);
            return false;
          }
        }]
      },
    //   {
    //     path: 'ui-components',
    //     loadChildren: () =>
    //       import('./pages/ui-components/ui-components.routes').then(
    //         (m) => m.UiComponentsRoutes
    //       ),
    //   },
    //   {
    //     path: 'extra',
    //     loadChildren: () =>
    //       import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
    //   },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
