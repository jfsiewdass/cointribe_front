import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } 
from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../../../../material.module';
@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MaterialModule],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.css'
})
export class DiceComponent {
  diceFaces = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix];
  currentFace = [faDiceOne, faDiceOne];
  isRolling = false;
  result = '';

  rollDice() {
      if (this.isRolling) return;
      this.isRolling = true;
      this.result = '';

      setTimeout(() => {
          this.result = '';
          setTimeout(() => {
              const randomFirstDice = Math.floor(Math.random() * this.diceFaces.length);
              const randomSecondDice = Math.floor(Math.random() * this.diceFaces.length);
              this.currentFace = [this.diceFaces[randomFirstDice], this.diceFaces[randomSecondDice]];
              this.result = `${randomFirstDice + 1} y ${randomSecondDice + 1}`;
              this.isRolling = false;
          }, 1500);
      }, 100);
  }
}
