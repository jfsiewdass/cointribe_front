import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';


export const AdminRoutes: Routes = [
  {
  path: '',
    children: [
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'withdrawals',
        component: WithdrawalsComponent
      },
      {
        path: 'bets',
        component: WithdrawalsComponent
      },
    ]
  }
  
];
