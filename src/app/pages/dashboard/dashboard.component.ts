import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, Web3Actions, IMEMBER_QUERY } from 'angular-web3';
import { utils } from 'ethers';
import { MessageService } from 'primeng/api';
import { interval, takeUntil, async, Subject } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { mockMember1, mockMember2 } from 'src/app/dapp-injector/services/graph-ql/mockQueries';
import { SuperFluidService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';
import { IPOOL_STATE, IPOOL_TOKEN } from 'src/app/shared/models/models';
import { ERC777Service } from 'src/app/shared/services/erc777.service';

import { GlobalService } from 'src/app/shared/services/global.service';
import { Floowdy } from 'src/assets/contracts/interfaces/Floowdy';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends DappBaseComponent implements OnInit, OnDestroy {
  balanceSupertoken = 0;
  poolToken?: IPOOL_TOKEN;
  poolState!: IPOOL_STATE;
  twoDec!: string;
  fourDec!: string;

  destroyQueries: Subject<void> = new Subject();
  destroyFormatting: Subject<void> = new Subject();

  depositAmountCtrl = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);

  member!:IMEMBER_QUERY;

  memberDisplay: any;  

  constructor(
    store: Store,
    dapp: DappInjector,
    public router: Router,
    public formBuilder: FormBuilder,
    public global: GlobalService,
    private graphqlService: GraphQlService,
    public erc777: ERC777Service,
    public msg: MessageService
  ) {
    super(dapp, store);
  }

  showStartFlow() {
    this.router.navigateByUrl('start-flow');
  }

  async wrapp() {}

  async mint() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await this.global.mint();
    this.refreshBalance();
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async deposit() {
    if (this.depositAmountCtrl.invalid) {
      this.msg.add({
        key: 'tst',
        severity: 'error',
        summary: 'OOPS',
        detail: `Value minimum to deposit 1 token`,
      });

      return;
    }

    let amount = utils.parseEther(this.depositAmountCtrl.value.toString());
    console.log(amount);
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await this.erc777.depositIntoPool(amount);
    this.refreshBalance();
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async refreshBalance() {
    let result = await this.global.getPoolToken();

    this.poolToken = result.poolToken;
    this.poolState = result.poolState;
    console.log(this.poolState);


  }

  ngOnInit(): void {}

  requestCredit() {
    this.router.navigateByUrl('request-credit');
  }

  async getCredits() {
    console.log('getCredits');
    this.destroyQueries.next()
   this.graphqlService
        .watchMember(this.dapp.signerAddress!)
        .pipe(takeUntil(this.destroyQueries))
        .subscribe((val: any) => {
          console.log(val)
          if (!!val && !!val.data && !!val.data.member) {
            let queryMember = val.data.member;
            this.member =  {
                deposit:queryMember.deposit,
                timestamp: queryMember.timestamp,
                flow:queryMember.flow,
                creditsRequested : queryMember.creditsRequested,
                creditsDelegated: queryMember.creditsDelegated.map((map:any)=> map.credit)
            }
               console.log(JSON.stringify(this.member))
       
    
        // let queryMember = mockMember1;



        //     this.member =  {
        //         deposit:queryMember.deposit,
        //         flow:queryMember.flow,
        //         timestamp: queryMember.timestamp,
        //         creditsRequested : queryMember.creditsRequested,
        //         creditsDelegated: queryMember.creditsDelegated
        //     }
        
            console.log(+this.member.flow)

        this.memberDisplay = {


        } 
            console.log(this.member.flow)
            console.log(this.member.timestamp)
        let value = +this.member.flow * ( (new Date().getTime() / 1000)- +this.member.timestamp);
        console.log(value)
        let formated = this.global.prepareNumbers(
          +this.member.deposit + value
        );
        this.twoDec = formated.twoDec;
        this.fourDec = formated.fourDec;
          
        console.log(+this.member.flow)

        if (+this.member.flow > 0) {
          this.destroyFormatting.next();
          let source = interval(500);
          source.pipe(takeUntil(this.destroyFormatting)).subscribe((val) => {
            const todayms = (new Date().getTime() / 1000)- +this.member.timestamp;
           
    
            let formated = this.global.prepareNumbers(
              +todayms * +this.member.flow +  +this.member.deposit
            );
            this.twoDec = formated.twoDec;
            this.fourDec = formated.fourDec;
          });
        }
      }
    });




  }

  override async hookContractConnected(): Promise<void> {
    this.refreshBalance();
    this.getCredits();
  }

  override ngOnDestroy(): void {
      this.destroyFormatting.next();
      this.destroyQueries.next()
      this.destroyFormatting.complete();
      this.destroyQueries.complete()
      super.ngOnDestroy()
  }

}
