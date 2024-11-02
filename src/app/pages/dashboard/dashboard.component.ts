import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppMonthlyEarningsComponent } from '../../core/components/monthly-earnings/monthly-earnings.component';
import { AppYearlyBreakupComponent } from '../../core/components/yearly-breakup/yearly-breakup.component';
import { AppSalesOverviewComponent } from '../../core/components/sales-overview/sales-overview.component';
import { UserData } from '../../core/intefaces/Auth';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppMonthlyEarningsComponent,
    AppYearlyBreakupComponent,
    AppSalesOverviewComponent,
    // AppRecentTransactionsComponent,
    // AppProductPerformanceComponent,
    // AppBlogCardsComponent
  ],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  userData!: UserData | null 
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private snackbar: SnackbarService
  ){}
  ngOnInit() {
    this.userData = this.tokenService.getUserData();
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
      // this.router.navigate([''])
    }

    localStorage.setItem('balance', this.userData?.wallet ? this.userData?.wallet?.balance?.toString(): '')
  }
}