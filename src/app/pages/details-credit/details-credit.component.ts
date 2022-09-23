import { AfterViewInit, Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, ICREDIT_DELEGATED, ICREDIT_REQUESTED, ROLE } from 'angular-web3';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

@Component({
  selector: 'app-details-credit',
  templateUrl: './details-credit.component.html',
  styleUrls: ['./details-credit.component.scss']
})
export class DetailsCreditComponent extends DappBaseComponent implements AfterViewInit {

  role: ROLE = 'loading';
  credit!: ICREDIT_DELEGATED
  constructor(dapp:DappInjector, store:Store, public route: ActivatedRoute, 
    public graphqlService: GraphQlService,
    public router: Router) { 
    super(dapp, store)
  }
  
  async getCredit(id:string) {
    let val =   await  this.graphqlService
    .getCredit(id)
      console.log(val.data)

      if (!!val && !!val.data ) {
        this.credit = val.data.credit
        console.log(this.credit)
        this.checkRole();
      }
  
   }

checkRole() {
    console.log(this.blockchain_status)
    if(this.blockchain_status == 'wallet-connected') {
      
      let signerAddress = this.dapp.signerAddress!.toLowerCase();
      let requester = this.credit.requester.member.toLowerCase();
      let delegators = this.credit.delegators.map(map=> map.member.member)


      if (this.credit!== undefined) {
    
          if ( requester == signerAddress) {
            this.role = 'requester';
            console.log(this.role)
          } else if( delegators.indexOf(signerAddress)!= -1){
            this.role = 'delegater'

          }  else {
            this.role = 'member';
          }
    }
 
    } else {
      this.role = 'none';
      console.log('NOOOOOOOO')
    }
    console.log(this.role)
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    const id = this.route.snapshot.params['id'];
    console.log(id)

    if (id == undefined) {
      this.router.navigateByUrl('dashboard');
    }

    this.getCredit(id)

  }

  override async hookContractConnected(): Promise<void> {
    
      console.log('should check tole')
      this.checkRole();
  }

}
