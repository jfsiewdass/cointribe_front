import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FontAwesomeModule, LottieComponent, TranslateModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
})
export class GamesComponent {
  faDice = faDice
  // Variables globales
  dados = [1, 1]; // Inicializamos con dos dados
  objetivo = 7; // Objetivo inicial
  puntaje = 0;

  // Función para lanzar los dados
  lanzarDados() {
    this.dados.forEach((dado, index) => {
      this.dados[index] = Math.floor(Math.random() * 6) + 1;
    });
    // console.log('====================================');
    // console.log(this.dados);
    // console.log('====================================');
    // Aquí se verificaría si se cumplió el objetivo y se actualizaría el puntaje
  }

  // Función para generar un nuevo objetivo
  nuevoObjetivo() {
    // Lógica para generar un nuevo objetivo basado en el puntaje actual
    this.objetivo = Math.floor(Math.random() * 11) + 2; // Ejemplo de generación aleatoria
  }

  // Función para verificar si se ganó
  verificarVictoria() {
    // Lógica para verificar si la suma de los dados es igual al objetivo
    // ...
  }
  options: AnimationOptions = {
    path: '/assets/AnimationDice_V2.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5)
  }

}
