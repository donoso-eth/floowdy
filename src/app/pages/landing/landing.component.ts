import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DappBaseComponent {
  pieData:any;
  pieOptions: any;
  constructor(private router: Router, store: Store, dapp: DappInjector
    
    ) {
    super(dapp, store);
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.pieData = {
      labels: ['STAKING','DELEGATING'],
      datasets: [
          {
              data: [ 33, 66],
              backgroundColor: [
                  "#37c5f4",
                  "#9d63a2",
                
              ],
              hoverBackgroundColor: [
                  "#37c5f4",
                  "#9d63a2",
               
              ]
          }
      ]
  };
  this.pieOptions = {
    plugins: {
        legend: {
            labels: {
                color: "#37c5f4"
            }
        }
    }
};

   
  }







  override async hookContractConnected(): Promise<void> {
    // this.pcrOptimisticOracleContract = this.dapp.DAPP_STATE.pcrOptimisticOracleContract!;
  
    // console.log(this.pcrOptimisticOracleContract)

    // this.pcrOptimisticOracleContract.instance.on('RewardDeposit',(args1,args2)=> {
    //     console.log(args1, args2)
    // })
   // this.router.navigate(['home'])

  }
}
