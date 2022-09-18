import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditTableComponent } from './credit-table/credit-table.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    CreditTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule
  ],
  exports:[CreditTableComponent]
})
export class CreditTableModule { }
