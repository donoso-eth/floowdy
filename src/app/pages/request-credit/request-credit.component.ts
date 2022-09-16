import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector } from 'angular-web3';
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

  constructor(
    dapp: DappInjector,
    store: Store,
    private graphqlService: GraphQlService
  ) {
    super(dapp, store);
  }

  ngOnInit(): void {}

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
