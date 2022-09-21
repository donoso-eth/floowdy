import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSummaryComponent } from './credit-summary/credit-summary.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LensProfileModule } from '../lens-profile/lens-profile.module';
import { StepsModule } from 'primeng/steps';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    CreditSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LensProfileModule,
    StepsModule
  ],
  exports: [
    CreditSummaryComponent
  ]
})
export class CreditSummaryModule { }
