import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ICREDIT_REQUESTED } from 'angular-web3';
import { blockTimeToTime, displayAdress, formatSmallEther } from 'src/app/shared/helpers/helpers';

@Component({
  selector: 'credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss']
})
export class CreditTableComponent extends DappBaseComponent implements OnInit {



  products:any;
  constructor(dapp: DappInjector, store:Store, public router:Router) {
    super(dapp, store)
    


   }

   displayAddress = displayAdress;
   blockTimeToTime = blockTimeToTime;
   formatSmallEther  = formatSmallEther ;
   
   @Input() credits!:Array<ICREDIT_DELEGATED> | Array<ICREDIT_REQUESTED> ;
   @Input() creditType!: 'loading' | 'none' | 'member' | 'requested' | 'delegated'; 

   goToCredit(id:string){
    this.router.navigateByUrl(`/details-credit/${id}`)
   }

   checkOut(id:string) {

   }
   
   stopCredit(id:string){

   }

  ngOnInit(): void {
    console.log(this.credits)
  }

}
