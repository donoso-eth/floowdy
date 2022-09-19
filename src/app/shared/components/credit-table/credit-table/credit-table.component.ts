import { Component, Input, OnInit } from '@angular/core';
import { ICREDIT_DELEGATED, ICREDIT_REQUESTED } from 'angular-web3';
import { blockTimeToTime, displayAdress } from 'src/app/shared/helpers/helpers';

@Component({
  selector: 'credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent implements OnInit {



  products:any;
  constructor() {
  
   }

   displayAddress = displayAdress;
   blockTimeToTime = blockTimeToTime;

   @Input() credits!:Array<ICREDIT_DELEGATED> | Array<ICREDIT_REQUESTED> ;
   @Input() creditType!: 'requested' | 'delegated'; 

   goToCredit(id:string){

   }

   checkOut(id:string) {

   }
   
  ngOnInit(): void {
  }

}
