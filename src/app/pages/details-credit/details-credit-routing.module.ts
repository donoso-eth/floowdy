import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsCreditComponent } from './details-credit.component';

const routes: Routes = [ { path: ':id', component: DetailsCreditComponent },
  { path: ':id', component: DetailsCreditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsCreditRoutingModule { }
