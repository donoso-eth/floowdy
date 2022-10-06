import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_REQUESTED } from 'angular-web3';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

@Component({
  selector: 'app-credit-marketplace',
  templateUrl: './credit-marketplace.component.html',
  styleUrls: ['./credit-marketplace.component.scss']
})
export class CreditMarketplaceComponent extends DappBaseComponent implements OnInit {

credits!:Array<ICREDIT_REQUESTED>

  constructor(dapp:DappInjector, store:Store, public graphqlService: GraphQlService) 
 {  super(dapp,store)}

 async getCredits() {
  let val =   await  this.graphqlService
  .getCredits()

    if (!!val && !!val.data ) {
      this.credits = val.data.credits
    }

    val =   await  this.graphqlService
    .getFullSearchCredit("jav")

      if (!!val && !!val.data ) {
        this.credits = val.data.credits
      }

 }

  ngOnInit(): void {
    this.getCredits()
  }

}
