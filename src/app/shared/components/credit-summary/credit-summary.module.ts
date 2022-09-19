import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSummaryComponent } from './credit-summary/credit-summary.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LensProfileModule } from '../lens-profile/lens-profile.module';


@NgModule({
  declarations: [
    CreditSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LensProfileModule 
  ],
  exports: [
    CreditSummaryComponent
  ]
})
export class CreditSummaryModule { }
