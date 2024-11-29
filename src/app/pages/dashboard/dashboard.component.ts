import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppBalanceComponent } from '../../core/components/balance/balance.component';
import { AppYearlyBreakupComponent } from '../../core/components/yearly-breakup/yearly-breakup.component';
import { AppSalesOverviewComponent } from '../../core/components/sales-overview/sales-overview.component';
import { UserData } from '../../core/intefaces/Auth';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { WalletService } from '../../core/services/transaction.service';
import {  TransactionComponent } from '../../core/components/transaction/transaction.component';
import { Transaction } from '../../core/intefaces/Transaction';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppBalanceComponent,
    // AppYearlyBreakupComponent,
    // AppSalesOverviewComponent,
    TransactionComponent,
    TranslateModule
    // AppRecentTransactionsComponent,
    // AppProductPerformanceComponent,
    // AppBlogCardsComponent
  ],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  userData!: UserData | null;
  transactions: Transaction[] = [];
  allTransactions: boolean = true
  page: number = 1
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private snackbar: SnackbarService,
    private txService: WalletService
  ){}
  
  ngOnInit() {
    this.userData = this.tokenService.getUserData();
    this.txService.loadTransactions();
    
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
    }
    localStorage.setItem('balance', this.userData?.wallet ? this.userData?.wallet?.balance?.toString(): '')
    this.txService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    });
  }
  more() {
    console.log('more');
    this.page++
    this.txService.loadTransactions(this.page);
  }
}