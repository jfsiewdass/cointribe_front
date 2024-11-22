import { Routes } from '@angular/router';
import { DiceComponent } from './components/dice/dice.component';
import { GamesComponent } from './components/games/games.component';

export const GameRoutes: Routes = [
  {
    path: '',
    component: GamesComponent,
    
  },
  {
    path: 'dice',
    component: DiceComponent,
  },
];
