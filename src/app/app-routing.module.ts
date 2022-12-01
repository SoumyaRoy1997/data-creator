import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'user',
  loadChildren: () => import('./signup-signin/login.module').then(m => m.LoginModule)
},{
  path: 'home',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{ path: '',
  redirectTo: '/user',
  pathMatch: 'full'
  },
  { path: '**', loadChildren: () => import('./signup-signin/login.module').then(m => m.LoginModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
