import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { CounterService } from '../../services/counter.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserData } from '../../../../core/intefaces/Auth';
import { TokenService } from '../../../../core/services/token.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { Router } from '@angular/router';
import { AppBalanceComponent } from '../../../../core/components/balance/balance.component';


@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TranslateModule,
    AppBalanceComponent
  ],
  templateUrl: './investment.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./investment.component.css'],
})
export class InvestmentComponent { 
  userData!: UserData | null;
  percent: number = 2.5
  perHour: number = 0.00
  isEarning: boolean = false
  earn: number = 0.00000000
  counterService = inject(CounterService)
  hasClaim:boolean = true
  balance: number = 0
  startDateStorage: string | null = null
  private tokenService = inject(TokenService)
  private snackbar = inject(SnackbarService)
  private router = inject(Router)
  ngOnInit() {
    this.userData = this.tokenService.getUserData();
    console.log(this.userData);
    
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
      this.router.navigate(['/'])
    }
    this.balance = this.userData?.wallet.earn ? parseFloat(this.userData?.wallet.earn!.toString()) : 0.00
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