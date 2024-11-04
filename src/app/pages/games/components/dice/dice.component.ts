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

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.css',
})
export class DiceComponent {
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
    {value: 'aPair', enable: true}, 
    {value:'consecutive', enable: true}, 
    {value:'equal', enable: true},  
    {value:'aPairConsecutive', enable: true}
  ];
  form!: FormGroup;
  bets: Map<string, number>;
  betHistory: Map<string, number>;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.bets = new Map<string, number>([
      ['pair', 0],
      ['patrol', 0],
      ['lookOut', 0],
      ['tribilin', 0],
      ['record', 0],
    ]);
    this.betHistory = this.bets
  }
  ngOnInit() {
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
  rollDice() {
    if (this.isRolling) return

    this.isRolling = true
    this.result = ''
    
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
          // ARE EQUAL
          (this.elected.find((e) => e.value == 'equal' && e.enable == true) &&
            randomFirstDice == randomSecondDice &&
            randomFirstDice == randomThirdDice) ||
          // ARE CONSECUTIVE
          (this.elected.find((e) => e.value == 'consecutive' && e.enable == true) &&
            this.areConsecutives([
              randomFirstDice,
              randomSecondDice,
              randomThirdDice,
            ])) ||
          // TWO EQUAL AND ONE CONSECUTIVE
          (this.elected.find((e) => e.value == 'aPairConsecutive' && e.enable == true) &&
            this.twoEqualAndOneConsecutive([
              randomFirstDice,
              randomSecondDice,
              randomThirdDice,
            ])) ||
           // A PAIR
           (this.elected.find((e) => e.value == 'aPair' && e.enable == true) &&
           this.pair([
             randomFirstDice,
             randomSecondDice,
             randomThirdDice,
           ]))
        ) {
          this.result = 'win'
        } else {
          this.result = 'lose'
        }
        this.isRolling = false
        this.isEnableToRoll = true
      }, 1500);
    }, 100);
  }
  
  activeRollBtn() {
    this.isEnableToRoll = false;
    this.clean()
  }

  areConsecutives(numbers: Array<number>) {
    numbers.sort((a, b) => a - b);
    return numbers[1] - numbers[0] === 1 && numbers[2] - numbers[1] === 1;
  }

  twoEqualAndOneConsecutive(numbers: Array<number>) {
    numbers.sort((a, b) => a - b);
    let iguales = 0;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === numbers[i - 1]) {
        iguales++;
      } else if (Math.abs(numbers[i] - numbers[i - 1]) !== 1) {
        return false;
      }
    }
    return iguales === 1;
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
    
    return foundPair;
  }
  clean() {
    this.form.reset();
  }

  setAmount(amount: number) {
    this.form.patchValue({ amount })
  }

  enable(i: number, type: string) {
    
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
    }, 1000);
  }

  generateRandomDice(){
    return Math.floor(Math.random() * this.diceFaces.length)
  }
  private _bottomSheet = inject(MatBottomSheet);

  openBottomSheet(): void {
    this._bottomSheet.open(BuyButtons).afterDismissed().subscribe(amount => {
      if (amount) {
        this.bets.forEach((_, key) => this.bets.set(key, amount / 5));
        this.betHistory = this.bets
      }
      this.getBet()
    });
  }
  getBet(): void {
    for (const valor of this.bets.values()) {
      if (valor <= 0) {
        this.isEnableToRoll = true;
      }
    }
    this.isEnableToRoll = false;
  }
  clearBet() {
    this.bets.forEach((_, key) => this.bets.set(key, 0))
    this.isEnableToRoll = true
  }
  setBet() {
    this.bets = this.betHistory
    this.isEnableToRoll = false
  }
}
