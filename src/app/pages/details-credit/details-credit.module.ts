import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsCreditRoutingModule } from './details-credit-routing.module';
import { DetailsCreditComponent } from './details-credit.component';
import { CreditSummaryModule } from 'src/app/shared/components/credit-summary/credit-summary.module';


@NgModule({
  declarations: [
    DetailsCreditComponent
  ],
  imports: [
    CommonModule,
    DetailsCreditRoutingModule,
    CreditSummaryModule 
  ]
})
export class DetailsCreditModule { }
