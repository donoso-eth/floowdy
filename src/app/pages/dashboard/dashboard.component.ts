import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { utils } from 'ethers';
import { MessageService } from 'primeng/api';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { IPOOL_TOKEN } from 'src/app/shared/models/models';
import { ERC777Service } from 'src/app/shared/services/erc777.service';

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
  
  depositAmountCtrl = new FormControl('',[Validators.required, Validators.min(1)]);


  constructor(
    store: Store, 
    dapp: DappInjector,   public router:Router,
    public formBuilder: FormBuilder,
   public global: GlobalService, 
   public erc777: ERC777Service,
   public msg:MessageService
  ) { 
    super(dapp,store);
    
 
  }

  showStartFlow(){
    this.router.navigateByUrl('start-flow')
  }

 async wrapp(){

 }

 async mint(){
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  await this.global.mint()
  this.refreshBalance();
  this.store.dispatch(Web3Actions.chainBusy({ status: false }));

 }
 
 async deposit() {
  if (this.depositAmountCtrl.invalid) {
    this.msg.add({ key: 'tst', severity: 'error', summary: 'OOPS', detail: `Value minimum to deposit 1 token` });
 
    return
  }


  let amount =  utils.parseEther(this.depositAmountCtrl.value.toString())
  console.log(amount)
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  await this.erc777.depositIntoPool(amount)
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
