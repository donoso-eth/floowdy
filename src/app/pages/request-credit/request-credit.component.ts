import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { ethers, utils } from 'ethers';
import { firstValueFrom } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { mockMember1 } from 'src/app/dapp-injector/services/graph-ql/mockQueries';
import { formatSmallEther } from 'src/app/shared/helpers/helpers';
import { ILENS_PROFILE } from 'src/app/shared/models/models';
import { CreditRequestOptionsStruct } from 'src/assets/contracts/interfaces/Floowdy';

@Component({
  selector: 'app-request-credit',
  templateUrl: './request-credit.component.html',
  styleUrls: ['./request-credit.component.scss'],
})
export class RequestCreditComponent
  extends DappBaseComponent
  implements OnInit
{
  lensLoading = true;
  lensProfile = false;
  aaveLoading: 'loading' | 'found' | 'none' = 'loading';
  aaveSettings = { };
  mockProfileActive = false;
  profiles:Array<ILENS_PROFILE> = [];
  requestCreditForm: FormGroup;
  durations = [
    { name: 'hours', id: 1, factor: 3600 },
    { name: 'weeks', id: 2, factor: 25200 },
    { name: 'days', id: 3, factor: 86400 },
    { name: 'months', id: 4, factor: 2592000 },
  ];
  profile!: ILENS_PROFILE;
  stableBorrowAPY!: number;
  availableBorrowsBase!:number;
  amountMax!: string;
  constructor(
    dapp: DappInjector,
    store: Store,
    private graphqlService: GraphQlService,
    public formBuilder: FormBuilder, public router:Router,
  ) {
    super(dapp, store);
    this.requestCreditForm = this.formBuilder.group({

      amountCtrl: [1000,[Validators.required, Validators.min(1)]],
      rateCtrl: [ 3,
        [Validators.required, Validators.min(3)],
      ],
      durationInCtrl: [
        { name: 'hours', id: 1, factor: 3600 },
        [Validators.required],
      ],
      installementsCtrl: [ 10,
        [Validators.required, Validators.min(1)],
      ],  
      profileCtrl: [false, Validators.requiredTrue],
      aaveCtrl: [false, Validators.requiredTrue] 
   
    })
  }

  formatSmallEther  = formatSmallEther ;

  ngOnInit(): void {}

  async mockProfile(){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message: {header:'Un momento...', body:'querying a random profile for you'}}))
    const val = await this.graphqlService.getMockProfile();

    this.profile = val.data.profile;
 
  
    this.lensProfile = true;
    this.requestCreditForm.controls.profileCtrl.setValue(true);
    this.mockProfileActive = false;
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }


  async requestCredit() {
    
    let amount = this.requestCreditForm.controls.amountCtrl.value *10 ** 6 ;
    let rate = this.requestCreditForm.controls.rateCtrl.value;
    let interval = this.requestCreditForm.controls.durationInCtrl.value.factor;
    let nrInstallments = this.requestCreditForm.controls.installementsCtrl.value;


    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message: {body:'Is going to take a while, credit almost dispatched', header:'Un momento'}}))

    let creditRequest: CreditRequestOptionsStruct = {
      amount,
      rateAave:rate,
      ratePool:rate,
      nrInstallments,
      interval,
      handle:'javier',
      bio:'javier'
    }

    await doSignerTransaction(this.dapp.defaultContract?.instance.requestCredit(creditRequest)!)

    this.router.navigateByUrl('dashboard')
  }

  override async hookContractConnected(): Promise<void> {

   this.graphqlService.getReserveData()
    .then(val=> {

      
      let RAY = 10**27 // 10 to the power 27
      let SECONDS_PER_YEAR = 31536000

      let reserveData = val.data.reserves[0];

      // Deposit and Borrow calculations
      // APY and APR are returned here as decimals, multiply by 100 to get the percents

     let  depositAPR = reserveData.liquidityRate/RAY
      let variableBorrowAPR = reserveData.variableBorrowRate/RAY
      let stableBorrowAPR = reserveData.variableBorrowRate/RAY



      let depositAPY = ((1 + (depositAPR/ SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
      let stableBorrowAPY = ((1 + (stableBorrowAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1

    })
   

    //let valMember =  await firstValueFrom(this.graphqlService.watchMember(this.dapp.signerAddress!));
    //console.log(valMember);

    let member = mockMember1;
   

    this.amountMax =  utils.formatEther(member.deposit);

    const val = await this.graphqlService.getProfilesRequest(this.dapp.signerAddress!);

    if (!!val && !!val.data) {
   

      this.profiles = val.data.profiles.items;
      this.profile  = this.profiles[0];
    
      if (this.profiles.length == 0) {
        this.lensProfile = false;
        this.requestCreditForm.controls.profileCtrl.setValue(false);
      } else {
        this.lensProfile = true;
        this.requestCreditForm.controls.profileCtrl.setValue(true);
      }
      this.lensLoading = false;
    } else {
      this.requestCreditForm.controls.profileCtrl.setValue(false);
      this.lensLoading = false;
    }

  
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.store.dispatch(Web3Actions.chainBusyWithMessage({message:{header:'Ein Moment Bitte', body:'Gettin last AAVE debt settings'}}))
  
   try {
      let result = await this.dapp.defaultContract?.instance.getAaveData();
      this.aaveLoading = 'found';
  

      this.availableBorrowsBase = +result?.availableBorrowsBase!;

      let SECONDS_PER_YEAR = 31536000

      let depositAPY = ((1 + (+result?.depositAPR!/10**27/ SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
      this.stableBorrowAPY = ((1 + (+result?.stableBorrowAPR!/10**27 / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1

      this.requestCreditForm.controls.aaveCtrl.setValue(true);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    } catch (error) {
      this.aaveLoading = 'none';
      this.requestCreditForm.controls.aaveCtrl.setValue(false)
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }



  }
}
