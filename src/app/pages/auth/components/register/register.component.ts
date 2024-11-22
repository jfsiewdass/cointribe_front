import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { RegisterForm } from '../../interfaces/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule, ReactiveFormsModule, TranslateModule] ,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class AppRegisterComponent {
  private authService = inject(AuthService);
  private _router = inject(Router);
  private tokenService = inject(TokenService);
  private snackbarService = inject(SnackbarService);
  matcher = new FormErrorStateMatcher();
  isSubmitted: boolean = false
  constructor() {}

  form = new FormGroup<RegisterForm>({
    firstName: new FormControl('',{nonNullable: true, validators:[Validators.required, Validators.minLength(6)]}),
    lastName: new FormControl('',{nonNullable: true, validators:[Validators.required, Validators.minLength(6)]}),
    email: new FormControl('', {nonNullable: true, validators:[Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators:[Validators.required, 
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/)
    ]}),
    confirmPassword: new FormControl('', {nonNullable: true, validators:[
      Validators.required, 
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/)
    ]}),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.authService.register(this.form.value).subscribe({
      next: (resp: any) => {
      //   this.tokenService.setAuthToken(resp.token);
      //   this.tokenService.setRefreshToken(resp.refreshToken)
      //   this.tokenService.setUserData({
      //     email: resp.email,
      //     wallet: resp.wallet
      //   });
      this._router.navigate(['/auth/email-confirm']);
      },
      error: (error: any) => {
        this.snackbarService.openSnackBar(error.message, 'error')
      },
    })
  }
  
}
