import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule, ReactiveFormsModule, TranslateModule] ,
  templateUrl: './register.component.html',
})
export class AppRegisterComponent {
  private authService = inject(AuthService);
  private _router = inject(Router);
  private tokenService = inject(TokenService);
  private snackbarService = inject(SnackbarService);
  constructor() {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
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
}
