import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
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
  profiles:Array<ILENS_PROFILE> = [];
  requestCreditForm: FormGroup;
  durations = [
    { name: 'hours', id: 1, factor: 3600 },
    { name: 'days', id: 2, factor: 86400 },
    { name: 'months', id: 3, factor: 2592000 },
  ];
  profile!: ILENS_PROFILE;
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
      profileCtrl: [false, Validators.requiredTrue] 
   
    })
  }

  ngOnInit(): void {}

  async requestCredit() {
    
    let amount = this.requestCreditForm.controls.amountCtrl.value;
    let rate = this.requestCreditForm.controls.rateCtrl.value;
    let interval = this.requestCreditForm.controls.durationInCtrl.value.factor;
    let nrInstallments = this.requestCreditForm.controls.installementsCtrl.value;

    console.log(nrInstallments);
    console.log(interval)

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    let creditRequest: CreditRequestOptionsStruct = {
      amount,
      rate,
      nrInstallments,
      interval,
      handle:'javier',
      bio:'javier'
    }

    await doSignerTransaction(this.dapp.defaultContract?.instance.requestCredit(creditRequest)!)

    this.router.navigateByUrl('dashboard')
  }

  override async hookContractConnected(): Promise<void> {
    const val = await this.graphqlService.getProfilesRequest();

    if (!!val && !!val.data) {
   
      console.log(val)
      this.profiles = val.data.profiles.items;
      this.profile  = this.profiles[0];
      console.log(val.data.profiles.items)
      if (this.profiles.length == 0) {
        this.lensProfile = false;
      } else {
        this.lensProfile = true;
        this.requestCreditForm.controls.profileCtrl.setValue(true);
      }
      this.lensLoading = false;
    } else {
      this.lensLoading = false;
    }



  }
}
