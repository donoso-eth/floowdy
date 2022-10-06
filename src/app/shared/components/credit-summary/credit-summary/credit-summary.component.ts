import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreditStatus, DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ROLE, settings, Web3Actions } from 'angular-web3';
import { constants, Contract } from 'ethers';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { aavePool_abi } from 'src/app/shared/helpers/abis/aavePool';
import { blockTimeToTime, createERC20Instance, displayAdress, formatSmallEther } from 'src/app/shared/helpers/helpers';
import { IPool } from 'src/assets/contracts/interfaces/IAAVEPool';
import { IERC20 } from 'src/assets/contracts/interfaces/IERC20';


@Component({
  selector: 'credit-summary',
  templateUrl: './credit-summary.component.html',
  styleUrls: ['./credit-summary.component.scss']
})
export class CreditSummaryComponent  extends DappBaseComponent implements OnChanges {
  lensProfile = false;
  stepItems!: { label: string }[];
  activeStep = 0;
  display_step! :CreditStatus;
  profile: any;
  lensLoading: boolean = true;
  constructor( public graphqlService:GraphQlService, dapp: DappInjector, store:Store) {super(dapp,store) 
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
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message: {body:'Is good to suppert pool members!!', header:'Un momento'}}))
   await doSignerTransaction(this.dapp.defaultContract?.instance.creditCheckIn(+this.credit.id)!)
    
    
  }

  rejectCredit(){

  }

  async executeCredit(){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message: {header:'A Moment please...', body:'We are executing the credit!'}}))
    let poolContract = new Contract(settings['goerli'].aavePool, aavePool_abi,this.dapp.signer!) as IPool;

      await doSignerTransaction(this.dapp.defaultContract?.instance.creditApproved(+this.credit.id)!)


    let erc20debt = createERC20Instance(settings['goerli'].debtToken,this.dapp.signer!) as IERC20;


    await doSignerTransaction(erc20debt.approve(this.defaultContract.address,constants.MaxUint256))

  let bal = await erc20debt.balanceOf(this.dapp.signerAddress!);

   await doSignerTransaction(poolContract.borrow(settings['goerli'].debtToken,this.credit.amount,1,0,this.defaultContract.address));
   bal = await erc20debt.balanceOf(this.dapp.signerAddress!);

   let allo = await erc20debt.allowance(this.dapp.signerAddress!, this.defaultContract.address);
 


  }

  async cancelCredit() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message: {body:'No Prob, credit cancelled', header:'Un momento'}}))
    await doSignerTransaction(this.dapp.defaultContract?.instance.cancelCredit(+this.credit.id)!)
     
     

    
  }
  
  ngOnChanges(): void {
    console.log(this.credit)
       this.display_step =  <CreditStatus>+this.credit.status;
      this.activeStep = this.display_step-1;
      console.log(this.role)

      this.graphqlService.getProfilesRequest("0x7A84b3CaAC4C00AFA0886cb2238dbb9788376581")
      .then(val=> {

      if (!!val && !!val.data) {
     
  
    
        this.profile  =  val.data.profiles.items[0];
      
        if (val.data.profiles.length == 0) {
          this.lensProfile = false;
              } else {
          this.lensProfile = true;
        
        }
        this.lensLoading = false;
      } else {
            this.lensLoading = false;
      }
  
    })
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));



  }

}
