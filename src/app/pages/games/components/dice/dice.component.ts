import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faQuestion,
  faCoins,
  faRotateBack,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../../../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import gsap from 'gsap';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BuyButtons } from './buy/buy-buttons.component';
import { UserData } from '../../../../core/intefaces/Auth';
import { TokenService } from '../../../../core/services/token.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { Router } from '@angular/router';
import { AppBalanceComponent } from '../../../../core/components/balance/balance.component';
import { BehaviorSubject, interval, Observable, Subject, takeWhile } from 'rxjs';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { MatDialog } from '@angular/material/dialog';
import { InstructionsComponent } from './instructions/instructions.component';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    LottieComponent
  ],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.css',
})
export class DiceComponent {
  readonly dialog = inject(MatDialog);
  options: AnimationOptions = {
    path: '/assets/AnimationMolino.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5)
  }
  userData!: UserData | null;
  faArrowsRotate = faArrowsRotate
  faRotateBack = faRotateBack
  faCoins = faCoins
  isMobile: boolean = false
  faQuestion = faQuestion
  faDiceOne = faDiceOne
  faDiceTwo = faDiceTwo
  faDiceThree = faDiceThree
  faDiceFour = faDiceFour
  faDiceFive = faDiceFive
  faDiceSix = faDiceSix
  diceFaces = [
    faDiceOne,
    faDiceTwo,
    faDiceThree,
    faDiceFour,
    faDiceFive,
    faDiceSix,
  ];
  currentFace = [faDiceOne, faDiceOne, faDiceOne];
  isRolling: boolean = false;
  isEnableToRoll: boolean = true;
  result = '';
  elected: Array<any> = [
    {value: 'pair', enable: true}, 
    {value:'consecutive', enable: true}, 
    {value:'equal', enable: true},  
    {value:'aPairConsecutive', enable: true}
  ];
  form!: FormGroup;
  bets: Map<string, number>;
  betHistory: Map<string, number>;
  winPrice: Map<string, number>;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.bets = new Map<string, number>([
      ['pair', 0],
      ['patrol', 0],
      ['lookOut', 0],
      ['tribilin', 0],
      ['record', 0],
    ]);
    this.winPrice = new Map<string, number>([
      ['pair', 2],
      ['patrol', 3],
      ['lookOut', 4],
      ['tribilin', 6],
      ['record', 8],
    ]);
    this.betHistory = this.bets
  }
  private tokenService = inject(TokenService)
  private snackbar = inject(SnackbarService)
  private router = inject(Router)
  balance: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private subscription: any;
  saldoInicial = 100;
  tiempoIntervalo = 1000;
  ngOnInit() {
    this.combinacionesPerdedoras()
    this.userData = this.tokenService.getUserData();
    
    if (!this.userData?.wallet) {
      this.snackbar.error({ statusCode: 500, message: 'wallet not set' })
      this.router.navigate(['/'])
    }
    this.balance.next(this.userData?.wallet.game ? parseFloat(this.userData?.wallet.game!.toString()) : 0.00)
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    });
    this.form = new FormGroup({
      amount: new FormControl(0, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999)
      ]),
    });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  rollDice() {
    if (this.isRolling) return

    this.isRolling = true
    this.result = ''
    const allBets = this.bets
    let amountBet = 0

    for (const value of allBets.values()) { amountBet += value }
    

    this.rollingDices()
    setTimeout(() => {
      setTimeout(() => {
        const randomFirstDice = this.generateRandomDice()
        const randomSecondDice = this.generateRandomDice()
        const randomThirdDice = this.generateRandomDice()
        
        this.currentFace = [
          this.diceFaces[randomFirstDice],
          this.diceFaces[randomSecondDice],
          this.diceFaces[randomThirdDice],
        ];

        if (
          // PAIR
          (this.pair([randomFirstDice, randomSecondDice,randomThirdDice])) ||
          // TRIBILIN
          (this.tribilin([randomFirstDice, randomSecondDice, randomThirdDice])) ||
          // ARE PATROL
          (this.patrol([randomFirstDice, randomSecondDice, randomThirdDice])) ||
          // OUTLOOK
          (this.outLook([randomFirstDice, randomSecondDice, randomThirdDice])) ||
          // RECORD
          (this.record([randomFirstDice, randomSecondDice,randomThirdDice]))
        ) {
          this.result = 'win'
        } else {
          this.result = 'lose'
          const currentBalance = this.balance.getValue() - amountBet;
          this.balance.next(currentBalance);
        }
        this.isRolling = false
        this.isEnableToRoll = true
       
        this.clearBet()
        
      }, 1500);
    }, 100);
    this.subscription?.unsubscribe();
  }
  
  activeRollBtn() {
    this.isEnableToRoll = false;
    this.clean()
  }

  pair(numbers: Array<number>) {
    const counts: any = {};
    numbers.forEach(num => {
      counts[num] = (counts[num] || 0) + 1;
    });
 
    let foundPair = false;
    for (const count of Object.values(counts)) {
      if (count === 2) {
        if (foundPair) {
          return false;
        }
        foundPair = true;
      }
    }

    numbers.sort((a, b) => a - b);
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] - numbers[i - 1] === 1) {
        return false;
      }
    }
    
    if (this.bets.get('pair')! > 0 && foundPair) {
      const totalBet = this.bets.get('pair')! * this.winPrice.get('pair')!
      this.setBalance(this.balance.getValue() + totalBet, true, 'Ronda')
    }

    
    return this.bets.get('pair') == 0 ? false : foundPair
    
  }

  patrol(numbers: Array<number>) {
    numbers.sort((a, b) => a - b);
    const foundConsecutives = numbers[1] - numbers[0] === 1 && numbers[2] - numbers[1] === 1

    if (this.bets.get('patrol')! > 0 && foundConsecutives) {
      const totalBet = this.bets.get('patrol')! * this.winPrice.get('patrol')!
      this.setBalance(this.balance.getValue() + totalBet, true, 'Patrulla')
    }
    return this.bets.get('patrol') == 0 ? false : foundConsecutives;
  }

  outLook(numbers: Array<number>) {
    numbers.sort((a, b) => a - b);
    let same = 0;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === numbers[i - 1]) {
        same++;
      } else if (Math.abs(numbers[i] - numbers[i - 1]) !== 1) {
        return false;
      }
    }
    if (this.bets.get('lookOut')! > 0 && same) {
      const totalBet = this.bets.get('lookOut')! * this.winPrice.get('lookOut')!
      this.setBalance(this.balance.getValue() + totalBet, true, 'Vigía')
    }
    return this.bets.get('lookOut') == 0 ? false : same === 1;
  }
  
  tribilin(numbers: Array<number>) {
    const equals = numbers[1] == numbers[0]  && numbers[2] ==  numbers[1]
    if (this.bets.get('tribilin')! > 0 && equals) {
      const totalBet = this.bets.get('tribilin')! * this.winPrice.get('tribilin')!
      this.setBalance(this.balance.getValue() + totalBet, true, 'Tribilín')
    }
    return this.bets.get('tribilin') == 0 ? false : equals
  }

  record(numbers: Array<number>) {
    const sort = numbers.sort((a, b) => a - b);
    let isRecord = sort.every((value, i) => value === [0, 4, 5][i])

    if (this.bets.get('record')! > 0 && isRecord) {
      const totalBet = this.bets.get('record')! * this.winPrice.get('record')!
      this.setBalance(this.balance.getValue() + totalBet, true, 'Registro')
    }
    return this.bets.get('record') == 0 ? false : isRecord
  }

  clean() {
    this.form.reset();
  }

  setAmount(amount: number) {
    this.form.patchValue({ amount })
  }

  enable(i: number, type: string) {
    if (this.getAmmountBet() + 1 > this.balance.getValue()) {
      this.snackbar.openSnackBar(`Monto insuficiente`, 'error', 3, 'bottom', 'center')
      return;
    }
    if ((this.bets.get(type) || 0) < 50) {
      this.bets.set(type, (this.bets.get(type) || 0) + 1);
    }
    this.betHistory = this.bets
    this.elected[i].enable = !this.elected[i].enable;
    this.getBet()
  }

  rollingDices() {
    const tl = gsap.timeline();
    tl.to('.dice', { rotationY: 360, duration: 1 });
    const interval = setInterval(() => {
      this.currentFace = [
        this.diceFaces[this.generateRandomDice()],
        this.diceFaces[this.generateRandomDice()],
        this.diceFaces[this.generateRandomDice()]
      ];
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      tl.reverse();
    }, 1500);
  }

  generateRandomDice(number: number | null = null){
    if (number) return number - 1
    return Math.floor(Math.random() * this.diceFaces.length)
  }
  private _bottomSheet = inject(MatBottomSheet);

  openBottomSheet(): void {
    this._bottomSheet.open(BuyButtons, {data: {
      balance: this.balance
    }}).afterDismissed().subscribe(amount => {
      if (amount) {
        if (amount <= this.balance.getValue()) {
          this.bets.forEach((_, key) => this.bets.set(key, amount / 5));
          this.betHistory = this.bets
        } else {
          this.snackbar.openSnackBar(`Monto insuficiente`, 'error', 3, 'bottom', 'center')
        }
      }
      this.getBet()
    });
  }
  getBet(): void {
    var countBet = 0
    for (const valor of this.bets.values()) {
      if (valor > 0) {
        countBet++
      }
    }
    if (countBet > 0) {
      this.isEnableToRoll = false;
    } else {
      this.isEnableToRoll = true;
    }
  }
  clearBet() {
    this.bets = new Map<string, number>([
      ['pair', 0],
      ['patrol', 0],
      ['lookOut', 0],
      ['tribilin', 0],
      ['record', 0],
    ]);
    this.isEnableToRoll = true
  }
  setBet() {
    if (this.bets != this.betHistory && this.getAmmountBet() <= this.balance.getValue()) {

      this.bets = this.betHistory
      this.isEnableToRoll = false
    } else {
      this.snackbar.openSnackBar(`Monto insuficiente`, 'error', 3, 'bottom', 'center')
    }
  }

  setBalance(target: number, win: boolean = false, type: string ) {
    if (win) {
      const bet = target - this.balance.getValue()
      this.snackbar.openSnackBar(`${type} Ganaste ${bet} USDT`, 'success', 3, 'bottom', 'center')
    }
    this.subscription = interval(100)
      .pipe(
        takeWhile(() => !win ? this.balance.getValue() > target : this.balance.getValue() < target)
      )
      .subscribe(() => {
        !win ? this.decrementBalance() : this.incrementBalance()
      });
    //this.subscription.unsubscribe();
  }
  incrementBalance() {
    const currentBalance = this.balance.getValue();
    const newBalance = currentBalance + 1;
    this.balance.next(newBalance);
  }
  decrementBalance() {
    const currentBalance = this.balance.getValue();
    const newBalance = currentBalance - 1;
    this.balance.next(newBalance);
  }
  getAmmountBet() {
    let amount = 0
    for (const value of this.bets.values()) { amount += value }

    return amount
  }
  decrease(type: string) {
    if (this.bets.get(type)! > 0) {
      this.bets.set(type, this.bets.get(type)! - 1)
    }
    this.getBet()
  }

  combinacionesPerdedoras() {
    const combinaciones = [];
  
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        for (let k = 1; k <= 6; k++) {
          const item = [i, j, k].sort((a, b) => a - b);
          const foundConsecutives = item[1] - item[0] === 1 && item[2] - item[1] === 1
          if (!(i === j && j === k) && !(i === 1 && j === 5 && k === 6) && !(i === j || j === k || i === k) && !foundConsecutives) {
            combinaciones.push([i, j, k]);
          }
        }
      }
    }
    // console.log(combinaciones);
    
    return combinaciones;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(InstructionsComponent, {
      //data: {name: this.name(), animal: this.animal()},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
      
    // });
  }
}
