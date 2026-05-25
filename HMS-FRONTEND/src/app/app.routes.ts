import { Routes } from '@angular/router';

import { Signup} from './pages/signup/signup';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Patients } from './pages/patients/patients';
import { Employees} from './pages/employees/employees';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'signup',component:Signup},
    {path:'login',component:Login},
    {path:'admin',component:DashboardLayout,canActivate:[authGuard],
        children:[
            {
                path:'dashboard',component:AdminDashboard
            },
            {
                path:'patients',component:Patients
            },
            {
                path:'employees',component:Employees
            }
        ]
    }

];
