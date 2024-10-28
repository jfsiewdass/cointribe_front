import { Component } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class AppLoginComponent {
  constructor(
    private router: Router,
    private socialService:SocialAuthService,
    private authService: AuthService,
  private tokenService: TokenService) {}
    ngOnInit() {
      this.socialService.authState.subscribe((user) => {
        console.log(user)
        this.router.navigate(['/'])
        //perform further logics
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
    // console.log(this.form.value);
    this.authService.login(this.form.value).subscribe({
      next: (resp: any) => {
        this.tokenService.setAuthToken(resp.token);
        this.tokenService.setRefreshToken(resp.refreshToken)
        this.tokenService.setUserData({
          FirstName: resp.FirstName,
          MiddleName: resp.MiddleName,
          Surname: resp.Surname,
          LastName: resp.LastName,
          Rol: resp.Rol
        });
      this.router.navigate(['/']);
      }
    })
  }
  
}
