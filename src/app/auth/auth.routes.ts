import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout.component';
import { LoginPage } from './pages/login-page/login-page.component';
import { RegisterPage } from './pages/register-page/register-page.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
