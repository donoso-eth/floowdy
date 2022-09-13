import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { MessageService } from 'primeng/api';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { IPOOL_TOKEN } from 'src/app/shared/models/models';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Flowdy } from 'src/assets/contracts/interfaces/Flowdy';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DappBaseComponent  implements OnInit {

  balanceSupertoken = 0;
  poolToken?: IPOOL_TOKEN;
  twoDec!: string;
  fourDec!: string;
  



  constructor(
    store: Store, 
    dapp: DappInjector,   public router:Router,
    public formBuilder: FormBuilder,
   public global: GlobalService, public msg:MessageService
  ) { 
    super(dapp,store);
    
 
  }

  showStartFlow(){
    this.router.navigateByUrl('start-flow')
  }

 async wrapp(){

 }

 async mint(){

  //await this.msg.add({ key: 'tst', severity: 'warn', summary: 'OOPS',detail: `Please Connect Your Wallet` });


  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  await this.global.mint()
  this.refreshBalance();
  this.store.dispatch(Web3Actions.chainBusy({ status: false }));

 }
 
 
 async refreshBalance() {
    
  this.poolToken = await this.global.getPoolToken();
  let formated = this.global.prepareNumbers(+this.poolToken.superTokenBalance!)
  this.twoDec = formated.twoDec; 
  this.fourDec = formated.fourDec; 
  //this.getRewardDetails(this.toUpdateReward!.id)

}

  ngOnInit(): void {
  
  }


  override async  hookContractConnected(): Promise<void> {
    this.refreshBalance()
  }

}
