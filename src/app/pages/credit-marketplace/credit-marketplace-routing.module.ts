import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditMarketplaceComponent } from './credit-marketplace.component';

const routes: Routes = [{ path: '', component: CreditMarketplaceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditMarketplaceRoutingModule { }
