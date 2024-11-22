import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
// import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UserData } from '../../../../core/intefaces/Auth';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { LoginForm } from '../../interfaces/forms';
import { environment } from '../../../../../environments/environment';
declare const google: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // GoogleSigninButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class AppLoginComponent {
  private _router = inject(Router);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private snackbarService = inject(SnackbarService);
  private document = inject(DOCUMENT)
  env = environment;
  constructor() {}
  

  form:FormGroup = new FormGroup<LoginForm>({
    email: new FormControl('', {nonNullable: true, validators:[Validators.required, Validators.minLength(6), Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators:[Validators.required]}),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value).subscribe({
      next: (resp: any) => {
        this.tokenService.setAuthToken(resp.token);
        this.tokenService.setRefreshToken(resp.refreshToken)
        
        this.tokenService.setUserData({
          email: resp.email,
          wallet: resp.wallet
        });
      this._router.navigate(['/']);
      },
      error: (error: any) => {
        this.snackbarService.openSnackBar(error.message, 'error')
      },
			// complete: () => {}
    })
  }
  ngOnInit(): void {
  }

  redirectToGoogle() {
    this.document.location.href = `${this.env.apiUrl}auth/google`
  }
}
