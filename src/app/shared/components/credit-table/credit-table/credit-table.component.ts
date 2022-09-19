import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ICREDIT_REQUESTED } from 'angular-web3';
import { blockTimeToTime, displayAdress } from 'src/app/shared/helpers/helpers';

@Component({
  selector: 'credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent extends DappBaseComponent implements OnInit {



  products:any;
  constructor(dapp: DappInjector, store:Store) {
    super(dapp, store)
    
    console.log(this.credits)

   }

   displayAddress = displayAdress;
   blockTimeToTime = blockTimeToTime;

   @Input() credits!:Array<ICREDIT_DELEGATED> | Array<ICREDIT_REQUESTED> ;
   @Input() creditType!: 'requested' | 'delegated'; 

   goToCredit(id:string){

   }

   checkOut(id:string) {

   }
   
   stopCredit(id:string){

   }

  ngOnInit(): void {
  }

}
