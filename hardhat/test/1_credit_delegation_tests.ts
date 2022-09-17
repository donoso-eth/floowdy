import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { initEnv, mineBlocks, setNextBlockTimestamp, waitForTx } from '../helpers/utils';
import * as hre from 'hardhat';
import { expect } from 'chai';
import { BaseProvider, TransactionReceipt } from '@ethersproject/providers';
import {
  ERC20,
  ERC20__factory,
  ERC777,
  ERC777__factory,
  Events__factory,
  Floowdy,
  Floowdy__factory,
  IOps,
  IOps__factory,
  ISuperfluid,
  ISuperfluidToken,
  ISuperfluidToken__factory,
  ISuperfluid__factory,
  ISuperToken,
  ISuperToken__factory,

} from '../typechain-types';

import { BigNumber, constants, Contract, utils } from 'ethers';
import {
  fromBnToNumber,
  getPeriod,
  getTimestamp,
  increaseBlockTime,
  IPERIOD,
  IPERIOD_RESULT,
  IUSER_CHECK,
  IUSER_RESULT,
  matchEvent,
  printPeriod,
  printPeriodTest,
  printUser,
  testPeriod,
} from './helpers/utils';
import { Framework, IWeb3FlowInfo, SFError } from '@superfluid-finance/sdk-core';

import { from } from 'rxjs';
import { ethers } from 'hardhat';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { FloowdyInitStruct } from '../typechain-types/Floowdy';
import { INETWORK_CONFIG } from '../helpers/models';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';


let floowdy: Floowdy;

let supertokenContract: ISuperToken;
let tokenContract: ERC777;
let contractsTest: any;


const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
let deployer: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let user4: SignerWithAddress;

let executor: any;
let provider: BaseProvider;
let eventsLib: any;
let sf: Framework;

let t0: number;
let ops: IOps;
let erc777: ERC777;
let erc20: ERC20;
let erc20Under:Contract;
let floowdyAddress: string;
let poolBalance: number;
let user1Balance: BigNumber;
let user2Balance: BigNumber;
let user3Balance: BigNumber;
let user4Balance: BigNumber;


let fromUser1Stream: IWeb3FlowInfo;
let fromUser2Stream: IWeb3FlowInfo;
let fromUser3Stream: IWeb3FlowInfo;
let fromUser4Stream: IWeb3FlowInfo;


let execData;
let execAddress;
let execSelector;
let resolverAddress;
let resolverData;
let resolverHash;

let taskId;

let ONE_DAY = 24 * 60 * 60

const processDir = process.cwd()
let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as INETWORK_CONFIG

let network_params = networks_config["goerli"];

describe.only('credit delegation tests', function () {
  beforeEach(async () => {
    await hre.network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: `https://goerli.infura.io/v3/1e43f3d31eea4244bf25ed4c13bfde0e`,
            blockNumber: 7608752,
          },
        },
      ],
    });

    [deployer, user1, user2, user3, user4] = await initEnv(hre);
    provider = hre.ethers.provider;
    let floowdy_init: FloowdyInitStruct= {
      host: network_params.host,
      superToken:network_params.superToken,
       token: network_params.token,
       pool:network_params.aavePool,
      aToken:network_params.aToken,
      ops:network_params.ops,
      epnsChannel: network_params.epnsChanel,
      epnsComm: network_params.epnsComm
       };


    floowdy = await new Floowdy__factory(deployer).deploy(floowdy_init);

    floowdyAddress = floowdy.address;
    console.log(floowdyAddress)
    eventsLib = await new Events__factory(deployer).deploy();

    supertokenContract = await ISuperToken__factory.connect(network_params.superToken, deployer);
    tokenContract = await ERC777__factory.connect(network_params.superToken, deployer);
    

    let initialPoolEth = hre.ethers.utils.parseEther('10');

    let balance = await provider.getBalance(floowdyAddress);

    await deployer.sendTransaction({ to: floowdyAddress, value: initialPoolEth });
    balance = await provider.getBalance(floowdyAddress);
    
    erc20Under = new hre.ethers.Contract(network_params.token,abi_erc20mint,
      deployer
    );
    
    let balanceSuper = await  erc20Under.balanceOf(deployer.address)

    await  waitForTx(erc20Under["mint(uint256)"](1000000000000))


    balanceSuper = await  erc20Under.balanceOf(deployer.address)

    tokenContract.approve(floowdyAddress, hre.ethers.constants.MaxUint256);

    ops = IOps__factory.connect(network_params.ops, deployer);

    contractsTest = {
      poolAddress: floowdyAddress,
      superTokenContract: supertokenContract,
      floowdy: floowdy,
      tokenContract,
      ops,
    };

    sf = await Framework.create({
      networkName: 'local',
      provider: provider,
      customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
      resolverAddress: network_params.sfResolver
    });

 


    erc20 = await ERC20__factory.connect(network_params.superToken, user1);
    // await waitForTx(erc20.increaseAllowance(floowdyAddress, hre.ethers.utils.parseEther("500")))

    /////// Cleaning and preparing init state /////////

    let amountInit = utils.parseEther('5');
    //await tokenContract.transfer(floowdyAddress, amountInit);

   

     await  waitForTx(erc20Under.connect(user1)["mint(uint256)"](1000000000000))

     await erc20Under.connect(user1).approve(network_params.superToken, constants.MaxInt256)
     let amountSuper = ethers.utils.parseEther("1000000")
     await waitForTx(supertokenContract.connect(user1).upgrade(amountSuper))
     user1Balance = await supertokenContract.balanceOf(user1.address);
 

    


    poolBalance = +(await tokenContract.balanceOf(floowdyAddress)).toString();
    //expect(poolBalance).to.equal(50 * 10 ** 18);

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0x25aD59adbe00C2d80c86d01e2E05e1294DA84823'],
    });

    executor = await hre.ethers.provider.getSigner('0x25aD59adbe00C2d80c86d01e2E05e1294DA84823');
  });

  it('should be successfull', async function () {
    // #region ================= FIRST PERIOD ============================= //

    console.log('\x1b[36m%s\x1b[0m', '#1--- User1 provides 20 units at t0 ');

    await expect (waitForTx(floowdy.connect(user1).requestCredit(20000000))).to.be.revertedWith("NOT_MEMBER");


   await waitForTx(supertokenContract.connect(user1).send(floowdyAddress, 20000, '0x'));

    t0 = +(await floowdy.poolTimestamp());


    let expedtedPoolBalance = utils.parseEther('50').add(BigNumber.from(20000));

  
    await expect (waitForTx(floowdy.connect(user1).requestCredit(20000000))).to.be.revertedWith("NOT_ENOUGH_COLLATERAL");

    user2Balance = await tokenContract.balanceOf(user2.address);

    

    await waitForTx(floowdy.connect(user1).requestCredit(30000));

  

    console.log('\x1b[36m%s\x1b[0m', '#1--- Period Tested #######');
    console.log('');

    // #endregion FIST PERIOD

    await setNextBlockTimestamp(hre, t0 + 10);

    // #region ================= SECOND PERIOD ============================= //

    console.log('\x1b[36m%s\x1b[0m', '#2--- User2 provides starts a stream at t0 + 10 ');


    user1Balance = await tokenContract.balanceOf(user1.address);
  
    let createFlowOperation = sf.cfaV1.createFlow({
      receiver: floowdyAddress,
      flowRate: '3858024691358',
      superToken: network_params.superToken,
      overrides: {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      },
    });
    await createFlowOperation.exec(user1);


    fromUser2Stream = await sf.cfaV1.getFlow({
      superToken: network_params.superToken,
      sender: user1.address,
      receiver: floowdyAddress,
      providerOrSigner: user1,
    });

    expedtedPoolBalance = utils.parseEther('50').add(BigNumber.from(20000));


    console.log('\x1b[36m%s\x1b[0m', '#2--- Period Tests passed ');
    console.log('');

    // #endregion SECOND PERIOD

 
      

      await setNextBlockTimestamp(hre, t0 + 20);



  });
});
