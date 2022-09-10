import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'minimal', pathMatch: 'full' },

  { path: 'minimal', loadChildren: () => import('./0-minimal-contract/minimal-contract.module').then(m => m.MinimalContractModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
