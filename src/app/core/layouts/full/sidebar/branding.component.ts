import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']" style="text-decoration: none;">
        <div class="d-flex align-items-center justify-content-center">
          <img
            src="./assets/images/logos/logo-2.svg"
            class="align-middle"
            alt="logo"
            [height]="50"
          />
          <span style="color: #000;font-family: Plus Jakarta Sans;font-size: 26px;font-weight:bolder"
            >Cointribe</span
          >
        </div>
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
