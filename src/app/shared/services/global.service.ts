import { Injectable } from '@angular/core';
import { DappInjector } from 'angular-web3';
import { ethers, Signer } from 'ethers';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { createERC20Instance } from '../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  erc20?: ethers.Contract;

  constructor(public dapp:DappInjector) { }

  getTokenInstance(){
    if (this.erc20 == undefined) {
      this.erc20 = createERC20Instance('0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',this.dapp.signer as Signer);
    }
  }
  
  getSuperTokenInstance(){
    if (this.supertoken == undefined) {
      this.superToken = createERC20Instance('0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',this.dapp.signer as Signer);
    }
  }

  async getBalance(){
    this.getTokenInstance()
  }


  async mint(){
    this.getTokenInstance()
    
    let signer = this.dapp.signer as Signer;
 
    let balance = await erc20.balanceOf(this.dapp.signerAddress);

    console.log(balance.toString());
     let amount = ethers.utils.parseEther("10000")
     await doSignerTransaction(erc20["mint(uint256)"](amount ))
     balance = await erc20.balanceOf(this.dapp.signerAddress);

     console.log(balance.toString());

  }
}
