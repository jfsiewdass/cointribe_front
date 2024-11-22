import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-google-redirect',
  standalone: true,
  imports: [],
  templateUrl: './google-redirect.component.html',
  styleUrl: './google-redirect.component.css'
})
export class GoogleRedirectComponent {
  user: any;
  private _router = inject(Router)
  private _route = inject(ActivatedRoute)
  private _tokenService = inject(TokenService)
  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      const resp = JSON.parse(atob(params['u']))
      console.log(resp);
      
      this._tokenService.setAuthToken(resp.token);
      this._tokenService.setRefreshToken(resp.refreshToken)
      
      this._tokenService.setUserData({
        email: resp.email,
        wallet: resp.wallet
      });
      this._router.navigate(['/']);
    });
  }
}
