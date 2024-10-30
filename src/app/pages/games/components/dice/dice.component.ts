import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
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
  elected: Array<any> = [{value: 'aPair', enable: true}, {value:'consecutive', enable: true}, {value:'equal', enable: true},  {value:'aPairConsecutive', enable: true}];
  form!: FormGroup;

  ngOnInit() {
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

  enable(i: number){
    this.elected[i].enable = !this.elected[i].enable;
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
}
