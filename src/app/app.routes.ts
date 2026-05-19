import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';

import { Employees } from './employees/employees';

import { Patients } from './patients/patients';

import { Login } from './login/login';

import { Profile } from './profile/profile';

import { authGuard } from './guards/auth-guard';

import { roleGuard } from './guards/role-guard';

export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'employees',
    component: Employees,

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      roles: ['ADM']
    }
  },

  {
    path: 'patients',
    component: Patients,

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      roles: [
        'ADM',
        'REC',
        'DOC',
        'NUR'
      ]
    }
  },

  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  }
];