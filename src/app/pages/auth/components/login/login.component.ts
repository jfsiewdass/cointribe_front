import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UserData } from '../../../../core/intefaces/Auth';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../../core/services/snackbar.service';

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
    GoogleSigninButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class AppLoginComponent {
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);
  private socialService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private snackbarService = inject(SnackbarService);

  constructor() {}
    ngOnInit() {
      this.socialService.authState.subscribe((user) => {
        this._router.navigate(['/'])
      });
    }

  form:FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
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
      error: (error: any) => this.snackbarService.openSnackBar(error, 'error'),
			// complete: () => {}
    })
  }
  
}
