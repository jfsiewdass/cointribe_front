import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'home',
  },
  {
    displayName: 'dashboard',
    iconName: 'dashboard',
    route: '/dashboard',
    active: '/dashboard'
  },
  {
    displayName: 'earn',
    iconName: 'payments',
    route: '/dashboard/earn',
    active: '/dashboard/earn'
  },
  {
    displayName: 'games',
    iconName: 'extension',
    route: '/dashboard/games',
    active: '/dashboard/games'
  },
  {
    displayName: 'user',
    iconName: 'account_circle',
    route: '/dashboard/admin/users',
    active: '/dashboard/admin/users'
  },
  {
    displayName: 'withdraw',
    iconName: 'payments',
    route: '/dashboard/admin/withdrawals',
    active: '/dashboard/admin/withdrawals'
  },
  {
    displayName: 'bets',
    iconName: 'casino',
    route: '/dashboard/admin/bets',
    active: '/dashboard/admin/bets'
  },
  // {
  //   displayName: 'Menu',
  //   iconName: 'file-text',
  //   route: '/ui-components/menu',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'file-text-ai',
  //   route: '/ui-components/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'clipboard-text',
  //   route: '/ui-components/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'table',
  //   route: '/ui-components/tables',
  // },
  // {
  //   navCap: 'Auth',
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'login',
  //   route: '/authentication/login',
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'user-plus',
  //   route: '/authentication/register',
  // },
  // {
  //   navCap: 'Extra',
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'mood-smile',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'brand-dribbble',
  //   route: '/extra/sample-page',
  // },
];
