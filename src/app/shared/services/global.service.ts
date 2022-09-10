import { Injectable } from '@angular/core';
import { DappInjector } from 'angular-web3';
import { constants, Contract, ethers, Signer } from 'ethers';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { createERC20Instance, createSupertokenInstance } from '../helpers/helpers';
import { ISuperToken} from 'src/assets/contracts/interfaces/ISuperToken';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  erc20?: ethers.Contract;
  supertoken?:ISuperToken

  constructor(public dapp:DappInjector) { }

  getTokenInstance(){
    if (this.erc20 == undefined) {
      this.erc20 = createERC20Instance('0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',this.dapp.signer as Signer);
    }
  }
  
  getSuperTokenInstance(){
    if (this.supertoken == undefined) {
      this.supertoken = createSupertokenInstance('0xbCE2198f789f3AC1Af76D3835BEe8A61830aAd34',this.dapp.signer as Signer) as ISuperToken;
    }
  }

  async getBalances(){
    this.getTokenInstance()
    this.getSuperTokenInstance();
    let balance = this.erc20?.balanceOf(this.dapp.signerAddress);
    let superbalance = this.supertoken?.realtimeBalanceOfNow(this.dapp.signerAddress as string)

    let result = await Promise.all( [balance, superbalance])

    console.log(result);

  }




  async mint(){


    this.getBalances()
    
    let signer = this.dapp.signer as Signer;
 
    let balance = await this.erc20?.balanceOf(this.dapp.signerAddress);

    console.log(balance.toString());
     let amount = ethers.utils.parseEther("10000")
     await doSignerTransaction( (this.erc20 as Contract)["mint(uint256)"](amount ))
     
     await doSignerTransaction((this.erc20 as Contract).approve(this.supertoken?.address, constants.MaxUint256)) 

     this.getBalances()
     await doSignerTransaction( (this.supertoken as ISuperToken).upgrade(amount))
    
     this.getBalances()

  }
}
