import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestCreditComponent } from './request-credit.component';

const routes: Routes = [{ path: '', component: RequestCreditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestCreditRoutingModule { }
