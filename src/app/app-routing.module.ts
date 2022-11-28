import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
},{
  path: 'home',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{ path: '',
  redirectTo: '/home',
  pathMatch: 'full'
  },
  { path: '**', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
