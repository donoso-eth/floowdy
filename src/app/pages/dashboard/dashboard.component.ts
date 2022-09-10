import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DappBaseComponent  implements OnInit {

  balanceSupertoken = 0;
  constructor(
    store: Store,
    dapp: DappInjector,
   public global: GlobalService
  ) { super(dapp,store)}

 async mint(){
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  await this.global.mint()
  this.store.dispatch(Web3Actions.chainBusy({ status: false }));

 }
 
 
  ngOnInit(): void {
  }

}
