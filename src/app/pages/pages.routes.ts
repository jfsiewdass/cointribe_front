import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvestmentComponent } from './investment/components/investment/investment.component';
import { DepositComponent } from './deposits/components/deposit/deposit.component';
import { GamesComponent } from './games/components/games/games.component';
import { DiceComponent } from './games/components/dice/dice.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'earn',
    component: InvestmentComponent
  },
  {
    path: 'deposit',
    component: DepositComponent
  },
  {
    path: 'games',
    loadChildren: () => import('./games/games.routes').then(m => m.GameRoutes),
  },
];
