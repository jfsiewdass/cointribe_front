import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MaterialModule, CommonModule, TranslateModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent {
  route = inject(ActivatedRoute)
  router = inject(Router)
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['token']) 
        this.authService.confirmEmail(params['token']).subscribe({
          next: (isVerified) => {
            if (isVerified) {
              const message = '<strong>¡Felicidades!</strong><br>Tu cuenta ha sido activada.<br>Ya puedes iniciar sesión';
              this.snackbarService.openSnackBar(message, 'success')
              this.router.navigate(['auth/login'])
            }
          }, error: (error) => this.snackbarService.openSnackBar(error.message, 'error')
        })
    });
  }
}
