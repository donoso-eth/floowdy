import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditMarketplaceRoutingModule } from './credit-marketplace-routing.module';
import { CreditMarketplaceComponent } from './credit-marketplace.component';
import { CreditSummaryModule } from 'src/app/shared/components/credit-summary/credit-summary.module';
import { CreditTableModule } from 'src/app/shared/components/credit-table/credit-table.module';


@NgModule({
  declarations: [
    CreditMarketplaceComponent
  ],
  imports: [
    CommonModule,
    CreditMarketplaceRoutingModule,
    CreditSummaryModule,
    CreditTableModule
  ]
})
export class CreditMarketplaceModule { }
