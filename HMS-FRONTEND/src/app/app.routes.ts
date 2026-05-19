import { Routes } from '@angular/router';

import { Signup} from './pages/signup/signup';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'signup',component:Signup},
    {path:'login',component:Login}

];
