import { Routes } from '@angular/router';

import { Signup} from './pages/signup/signup';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'signup',component:Signup},
    {path:'login',component:Login},
    {path:'admin-dashboard',component:AdminDashboard,canActivate:[authGuard]}

];
