import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSummaryComponent } from './credit-summary/credit-summary.component';



@NgModule({
  declarations: [
    CreditSummaryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CreditSummaryComponent
  ]
})
export class CreditSummaryModule { }
