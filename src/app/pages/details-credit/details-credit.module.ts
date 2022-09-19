import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsCreditRoutingModule } from './details-credit-routing.module';
import { DetailsCreditComponent } from './details-credit.component';


@NgModule({
  declarations: [
    DetailsCreditComponent
  ],
  imports: [
    CommonModule,
    DetailsCreditRoutingModule
  ]
})
export class DetailsCreditModule { }
