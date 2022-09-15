import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestCreditRoutingModule } from './request-credit-routing.module';
import { RequestCreditComponent } from './request-credit.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LensProfileModule } from 'src/app/shared/components/lens-profile/lens-profile.module';


@NgModule({
  declarations: [
    RequestCreditComponent
  ],
  imports: [
    CommonModule,
    RequestCreditRoutingModule,
    ProgressSpinnerModule,
    LensProfileModule
  ]
})
export class RequestCreditModule { }
