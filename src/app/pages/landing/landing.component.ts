import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappBaseComponent, DappInjector, IPOOL, Web3Actions } from 'angular-web3';
import { BigNumber, utils } from 'ethers';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { blockTimeToTime } from 'src/app/shared/helpers/helpers';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DappBaseComponent implements OnInit{
  pieData:any;
  pieOptions: any;
  barData:any;
  barOptions:any;

  currentPool!:IPOOL
    totalTvl: any;
    totalYieldStake!: any;

  constructor(private router: Router, store: Store, dapp: DappInjector, public graphqlService:GraphQlService
    
    ) {
    super(dapp, store);
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.pieData = {
      labels: ['aave','credit'],
      datasets: [
          {
              data: [ 0,0],
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
          data: []
      },
      {
          label: 'staked',
          backgroundColor: '#00bb7e',
          data: []
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
              color: 'white',
              callback: (label:any) => `$ ${label>1000000 ? label/10**6 : 0}`,
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

  getPool(){


    this.graphqlService.watchPool().subscribe(val=> {
        if (!!val && !!val.data && !!val.data.pools) { 
        
            console.log(JSON.stringify(val.data.pools))
            let staked =  val.data.pools.map((map:any)=> map.totalStaked);
            console.log(staked);
            let balance=  val.data.pools.map((map:any)=> map.totalDeposit/10**12);
            let labels=  val.data.pools.map((map:any)=> blockTimeToTime(map.timestamp));
            this.currentPool = val.data.pools[0];
            this.barData = {
                labels:labels.reverse(),
                datasets: [
                    {
                        label: 'pool balance',
                        backgroundColor: '#2f4860',
                        data: balance.reverse()
                    },
                    {
                        label: 'staked',
                        backgroundColor: '#00bb7e',
                        data: staked.reverse()
                    }
                ]
              };

          
            console.log(this.currentPool);

            let currentTimestamp = new Date().getTime()/1000;
            console.log(BigNumber.from(this.currentPool.totalDeposit))
            this.totalYieldStake = +this.currentPool.totalYieldStake;

           this.totalTvl = utils.formatEther(BigNumber.from(this.currentPool.totalDeposit))
             
    
            this.pieData = {
                labels: ['aave','credit'],
                datasets: [
                    {
                        data: [ this.totalYieldStake,+this.currentPool.totalYieldCredit],
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

        }
    })
  }

  ngOnInit() {
    this.getPool()
  }
}
