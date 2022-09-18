import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestCreditRoutingModule } from './request-credit-routing.module';
import { RequestCreditComponent } from './request-credit.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LensProfileModule } from 'src/app/shared/components/lens-profile/lens-profile.module';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    RequestCreditComponent
  ],
  imports: [
    CommonModule,
    RequestCreditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    LensProfileModule,
    DividerModule,
    ButtonModule,
    InputNumberModule
  ]
})
export class RequestCreditModule { }
