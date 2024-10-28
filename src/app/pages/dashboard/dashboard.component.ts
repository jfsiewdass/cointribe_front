import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppMonthlyEarningsComponent } from '../../core/components/monthly-earnings/monthly-earnings.component';
import { AppYearlyBreakupComponent } from '../../core/components/yearly-breakup/yearly-breakup.component';
import { AppSalesOverviewComponent } from '../../core/components/sales-overview/sales-overview.component';

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
export class DashboardComponent { }