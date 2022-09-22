import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ROLE } from 'angular-web3';
import { blockTimeToTime, displayAdress } from 'src/app/shared/helpers/helpers';

enum CreditStatus {
  NONE,
  PHASE1,
  PHASE2,
  PHASE3,
  PHASE4,
  APPROVED
}

@Component({
  selector: 'credit-summary',
  templateUrl: './credit-summary.component.html',
  styleUrls: ['./credit-summary.component.scss']
})
export class CreditSummaryComponent  extends DappBaseComponent implements OnInit {

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
  @Input() credit!:ICREDIT_DELEGATED;
  @Input() role!: ROLE

  doRefresh(){}

  checkInPhase1(){

  }

  checkInPhase10(){
    
  }
  checkInPhase5(){
    
  }

  rejectCredit(){

  }

  executeCredit(){
    
  }

  cancelCredit() {
    
  }
  
  ngOnInit(): void {
    console.log(this.credit)
       this.display_step =  <CreditStatus>+this.credit.status;
    
  }

}
