import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counterSource = new BehaviorSubject<number>(0);
  private claimSource = new BehaviorSubject<boolean>(false)
  counter$ = this.counterSource.asObservable();
  claim$ = this.claimSource.asObservable();
  private interval: any;
  private limitHour = 0.01;
  
  startCounter(profitPerHour: number, startDate: Date | null = null) {
    const date = startDate ? new Date(startDate) : new Date();
    localStorage.setItem('startDate', date.toISOString());

    this.claimSource.next(false);
    this.interval = setInterval(() => {
        const now = new Date();
        const diferenceInMiliSeconds = now.getTime() - date.getTime();
        const diferenceInHours = diferenceInMiliSeconds / (1000 * 60 * 60);
        
        if (diferenceInHours <= this.limitHour) {
          const totalProfit = diferenceInHours * profitPerHour;
          this.counterSource.next(totalProfit);
        } else {
          const totalProfit = this.limitHour * profitPerHour;
          this.counterSource.next(totalProfit);
          this.stopCounter()
        }
    }, 1000);
  }

  stopCounter() {
    clearInterval(this.interval);
    this.claimSource.next(true);
  }
  clearCounter() {
    this.counterSource.next(0);
  }
}