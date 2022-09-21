import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'start-flow', loadChildren: () => import('./pages/start-flow/start-flow.module').then(m => m.StartFlowModule) },
  { path: 'request-credit', loadChildren: () => import('./pages/request-credit/request-credit.module').then(m => m.RequestCreditModule) },
  { path: 'details-credit', loadChildren: () => import('./pages/details-credit/details-credit.module').then(m => m.DetailsCreditModule) },
  { path: 'credit-marketplace', loadChildren: () => import('./pages/credit-marketplace/credit-marketplace.module').then(m => m.CreditMarketplaceModule) },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
