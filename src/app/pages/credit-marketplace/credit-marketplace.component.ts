import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector } from 'angular-web3';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

@Component({
  selector: 'app-credit-marketplace',
  templateUrl: './credit-marketplace.component.html',
  styleUrls: ['./credit-marketplace.component.scss']
})
export class CreditMarketplaceComponent extends DappBaseComponent implements OnInit {

  constructor(dapp:DappInjector, store:Store, public graphqlService: GraphQlService) 
 {  super(dapp,store)}

 async getCredits() {
  let val =   await  this.graphqlService
  .getCredits()
  console.log(val);
    if (!!val && !!val.data ) {
      console.log(val.data)
    }

 }

  ngOnInit(): void {
    this.getCredits()
  }

}
