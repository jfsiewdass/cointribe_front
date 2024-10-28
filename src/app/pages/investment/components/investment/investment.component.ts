import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { CounterService } from '../../services/counter.service';
import { TranslateModule } from '@ngx-translate/core';
// import { AppSalesOverviewComponent } from '../../components/sales-overview/sales-overview.component';
// import { AppYearlyBreakupComponent } from '../../components/yearly-breakup/yearly-breakup.component';
// import { AppMonthlyEarningsComponent } from '../../components/monthly-earnings/monthly-earnings.component';
// import { AppRecentTransactionsComponent } from '../../components/recent-transactions/recent-transactions.component';
// import { AppProductPerformanceComponent } from '../../components/product-performance/product-performance.component';
// import { AppBlogCardsComponent } from '../../components/blog-card/blog-card.component';


@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TranslateModule
    // AppSalesOverviewComponent,
    // AppYearlyBreakupComponent,
    // AppMonthlyEarningsComponent,
    // AppRecentTransactionsComponent,
    // AppProductPerformanceComponent,
    // AppBlogCardsComponent
  ],
  templateUrl: './investment.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./investment.component.css'],
})
export class InvestmentComponent { 
  percent: number = 2.5
  perHour: number = 0.00
  isEarning: boolean = false
  earn: number = 0.00000000
  counterService = inject(CounterService)
  hasClaim:boolean = true
  balance: number = 0
  startDateStorage: string | null = null
  ngOnInit() {
    this.balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')!.toString()) : 0.00
    // console.log(this.perHour);
    this.setProfitPerHour()
    this.startDateStorage = localStorage.getItem('startDate')

    if (this.startDateStorage) {
      const startDate =  new Date(this.startDateStorage)
      const now = new Date()
      const diferenceInMiliSeconds = now.getTime() - startDate.getTime()
      const diferenceInHours = diferenceInMiliSeconds / (1000 * 60 * 60)

      if (diferenceInHours <= 3) {
        this.counterService.startCounter(this.perHour, startDate)
        this.isEarning = !this.isEarning
      }
    }
    this.counterService.counter$.subscribe(value => { this.earn = value })
    this.counterService.claim$.subscribe(value => { this.hasClaim = value })
    
  }

  ngOnDestroy() {
    this.counterService.stopCounter();
  }

  subscribe() {
    this.counterService.startCounter(this.perHour)
    this.isEarning = !this.isEarning
    this.hasClaim = false
  }
  claim() {
    this.isEarning = !this.isEarning
    this.hasClaim = false
    localStorage.removeItem('startDate')
    this.balance += this.earn
    this.earn = 0
    localStorage.setItem('balance', this.balance.toString())
    this.setProfitPerHour()
  }
  setProfitPerHour() {
    let decimalConvert = this.percent / 100;
    let dailyReward = decimalConvert * this.balance;
    this.perHour = dailyReward / 24;
  }
}