import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { ILENS_PROFILE } from 'src/app/shared/models/models';

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

  constructor(
    dapp: DappInjector,
    store: Store,
    private graphqlService: GraphQlService,
    public formBuilder: FormBuilder, public router:Router,
  ) {
    super(dapp, store);
    this.requestCreditForm = this.formBuilder.group({

      amountCtrl: [10],
      flowRateTimeCtrl: [
        { name: 'months', id: 3, factor: 2592000 },
        [Validators.required],
      ],
      flowRateConditionCtrl: [
        { condition: 'No stop',  id: 0 },
        [Validators.required],
      ],
    })
  }

  ngOnInit(): void {}

  async requestCredit() {
    
    let amount = this.requestCreditForm.controls.amountCtrl.value;
    
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    await doSignerTransaction(this.dapp.defaultContract?.instance.requestCredit(amount)!)

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  override async hookContractConnected(): Promise<void> {
    const val = await this.graphqlService.getProfilesRequest();

    if (!!val && !!val.data) {
   
      this.profiles = val.data.profiles.items;
      if (this.profiles.length == 0) {
        this.lensProfile = false;
      } else {
        this.lensProfile = true;
      }
      this.lensLoading = false;
    } else {
      this.lensLoading = false;
    }



  }
}
