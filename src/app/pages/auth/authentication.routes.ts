import { Routes } from '@angular/router';

import { AppLoginComponent } from './components/login/login.component';
import { AppRegisterComponent } from './components/register/register.component';
import { AppForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GoogleRedirectComponent } from './components/google-redirect/google-redirect.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppLoginComponent,
      },
      {
        path: 'register',
        component: AppRegisterComponent,
      },
      {
        path: 'forgot-password',
        component: AppForgotPasswordComponent
      },
      {
        path: 'success',
        component: GoogleRedirectComponent,
      },
    ],
  },
];
