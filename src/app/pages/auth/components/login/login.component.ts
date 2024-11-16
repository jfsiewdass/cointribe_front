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
// import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UserData } from '../../../../core/intefaces/Auth';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../../core/services/snackbar.service';
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

  constructor() {}
  

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
      error: (error: any) => {
        this.snackbarService.openSnackBar(error.message, 'error')
      },
			// complete: () => {}
    })
  }
  ngOnInit(): void {

    //this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    // debugger
    google.accounts.id.initialize({
      client_id: '504407133366-u42kir3euijugoe3e0bi842vl.apps.googleusercontent.com',
      callback: (resp: any) => this.handleCredentialResponse(resp)
      
    });
    
    google.accounts.id.prompt(); 
  }

  triggerGoogleSignIn() {
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Try manual rendering
        google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          { theme: "outline", size: "large", shape: 'rectangle', width: 350 }
        );
      }
    });
  }
  handleCredentialResponse(response: any) {
    console.log(response);
    // const payload = this.decodedToken(response)
    
  }
  private decodedToken(token: any) {
    return JSON.parse(atob(token.split(".")[1]))
  }
  googleSignIn() {
    this.authService.googleLogin().subscribe({
      next: (res) => {
        if (res.isNewUser) {
          // Handle new user registration
          console.log('New user registered via Google');
        } else {
          // Handle existing user login
          console.log('Existing user logged in via Google');
        }
          // const redirectUrl = this.authService.getRedirectUrl();
          const defaultRedirectUrl = '/user';
  
          // Use the router's navigateByUrl method to navigate and reload the page
          this._router.navigateByUrl(defaultRedirectUrl).then(() => {
            window.location.reload();
          });
        }
      ,
      error: (error) => {
        console.error('Google authentication failed', error);
        // this.avail = true;
        // this.msg = 'Google authentication failed. Please try again.';
      }
    });
  }
  windowOpen() {
    window.location.href = "http://localhost:6003/api/auth/google"
    //, "_blank",  "width=1000,height=600,top=100,left=100,toolbar=no,menubar=no")
  }
}
