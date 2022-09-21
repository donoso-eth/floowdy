import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditMarketplaceRoutingModule } from './credit-marketplace-routing.module';
import { CreditMarketplaceComponent } from './credit-marketplace.component';


@NgModule({
  declarations: [
    CreditMarketplaceComponent
  ],
  imports: [
    CommonModule,
    CreditMarketplaceRoutingModule
  ]
})
export class CreditMarketplaceModule { }
