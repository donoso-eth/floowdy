import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreditStatus, DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ROLE, Web3Actions } from 'angular-web3';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { blockTimeToTime, displayAdress, formatSmallEther } from 'src/app/shared/helpers/helpers';


@Component({
  selector: 'credit-summary',
  templateUrl: './credit-summary.component.html',
  styleUrls: ['./credit-summary.component.scss']
})
export class CreditSummaryComponent  extends DappBaseComponent implements OnChanges {

  stepItems!: { label: string }[];
  activeStep = 0;
  display_step! :CreditStatus;
  constructor(dapp: DappInjector, store:Store) {super(dapp,store) 
    this.stepItems = [
      {label: 'One Delegator Match'},
      {label: '10 Delegators'},
      {label: '5 Delegators and Pool'},
      {label: 'Approved & Waiting for Execution'},
  ];
  }

  displayAdress =  displayAdress;
  blockTimeToTime = blockTimeToTime;
  formatSmallEther  = formatSmallEther ;
  @Input() credit!:ICREDIT_DELEGATED;
  @Input() role!: ROLE

  doRefresh(){}

  // checkInPhase1(){

  // }

  // checkInPhase10(){
    
  //}
  async checkInPhase(){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
   await doSignerTransaction(this.dapp.defaultContract?.instance.creditCheckIn(+this.credit.id)!)
    
    
  }

  rejectCredit(){

  }

  executeCredit(){
    
  }

  async cancelCredit() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.defaultContract?.instance.cancelCredit(+this.credit.id)!)
     
     

    
  }
  
  ngOnChanges(): void {
    console.log(this.credit)
       this.display_step =  <CreditStatus>+this.credit.status;
      this.activeStep = this.display_step-1;
      console.log(this.role)
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

}
