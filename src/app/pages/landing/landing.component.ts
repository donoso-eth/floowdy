import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappBaseComponent, DappInjector, Web3Actions } from 'angular-web3';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DappBaseComponent {
  pieData:any;
  pieOptions: any;
  barData:any;
  barOptions:any;
  constructor(private router: Router, store: Store, dapp: DappInjector, public graphqlService:GraphQlService
    
    ) {
    super(dapp, store);
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.pieData = {
      labels: ['aave','credit'],
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

this.barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
      {
          label: 'pool balance',
          backgroundColor: '#2f4860',
          data: [65, 59, 80, 81, 56, 70, 40]
      },
      {
          label: 'staked',
          backgroundColor: '#00bb7e',
          data: [28, 48, 40, 19, 30, 37, 25]
      }
  ]
};



this.barOptions = {

  plugins: {
      legend: {
          labels: {
              color: '#495057'
          }
      }
  },
  scales: {
      x: {
          ticks: {
              color: 'white'
          },
          grid: {
              color:  '#1d3351',
          }
      },
      y: {
          ticks: {
              color: 'white'
          },
          grid: {
              color:  '#1d3351',
          }
      },
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
