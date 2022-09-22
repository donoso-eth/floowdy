import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ROLE } from 'angular-web3';

enum CreditStatus {
  NONE,
  PHASE1,
  PHASE2
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

  @Input() credit!:ICREDIT_DELEGATED;
  @Input() role!: ROLE

  checkInPhase1(){

  }

  checkInPhase10(){
    
  }
  checkInPhase5(){
    
  }

  executeCredit(){
    
  }


  
  ngOnInit(): void {
    if ( <CreditStatus>+this.credit.status == CreditStatus.PHASE1) {
      this.display_step = CreditStatus.PHASE1;
    } 
  }

}
