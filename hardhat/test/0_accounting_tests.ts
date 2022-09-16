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
  ISuperfluidToken,
  ISuperfluidToken__factory,

} from '../typechain-types';

import { BigNumber, utils } from 'ethers';
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


let floowdy: Floowdy;

let supertokenContract: ISuperfluidToken;
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
let poolTokenAddress: string;
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
const processDir = process.cwd()
let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as 
{ [key:string]:{ ops:string, host:string, token:string, superToken:string, aavePool:string, aToken:string}}

let network_params = networks_config["goerli"];

describe('Accounting test2', function () {
  beforeEach(async () => {
    await hre.network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.MUMBAI_URL || '',
            blockNumber: 26566623,
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
      ops:network_params.ops
       };


    floowdy = await new Floowdy__factory(deployer).deploy(floowdy_init);

    eventsLib = await new Events__factory(deployer).deploy();

    supertokenContract = await ISuperfluidToken__factory.connect(network_params.superToken, deployer);
    tokenContract = await ERC777__factory.connect(network_params.superToken, deployer);

 



    let initialPoolEth = hre.ethers.utils.parseEther('10');

    let balance = await provider.getBalance(poolTokenAddress);

    await deployer.sendTransaction({ to: poolTokenAddress, value: initialPoolEth });
    balance = await provider.getBalance(poolTokenAddress);
 

    tokenContract.approve(poolTokenAddress, hre.ethers.constants.MaxUint256);

    ops = IOps__factory.connect(network_params.ops, deployer);

    contractsTest = {
      poolAddress: poolTokenAddress,
      superTokenContract: supertokenContract,
      floowdy: floowdy,
      tokenContract,
      ops,
    };

    sf = await Framework.create({
      networkName: 'local',
      provider: provider,
      customSubgraphQueriesEndpoint: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
      resolverAddress: '0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3',
    });

 

    erc20 = await ERC20__factory.connect(network_params.superToken, user2);
    // await waitForTx(erc20.increaseAllowance(poolTokenAddress, hre.ethers.utils.parseEther("500")))

    /////// Cleaning and preparing init state /////////
    await tokenContract.transfer(poolTokenAddress, utils.parseEther('50'));

    user1Balance = await tokenContract.balanceOf(user1.address);

    user2Balance = await tokenContract.balanceOf(user2.address);

    user3Balance = await tokenContract.balanceOf(user3.address);

    user4Balance = await tokenContract.balanceOf(user4.address);

    if (user1Balance.toString() !== '0') {
      await tokenContract.connect(user1).transfer(deployer.address, user1Balance);
    }
    await tokenContract.transfer(user1.address, utils.parseEther('10'));

    if (user2Balance.toString() !== '0') {
      await tokenContract.connect(user2).transfer(deployer.address, user2Balance);
    }
    await tokenContract.transfer(user2.address, utils.parseEther('10'));

    if (user3Balance.toString() !== '0') {
      await tokenContract.connect(user3).transfer(deployer.address, user3Balance);
    }
    await tokenContract.transfer(user3.address, utils.parseEther('10'));

    if (user4Balance.toString() !== '0') {
      await tokenContract.connect(user4).transfer(deployer.address, user4Balance);
    }
    await tokenContract.transfer(user4.address, utils.parseEther('10'));

    user1Balance = await tokenContract.balanceOf(user1.address);
    user2Balance = await tokenContract.balanceOf(user2.address);
    user3Balance = await tokenContract.balanceOf(user3.address);
    user4Balance = await tokenContract.balanceOf(user4.address);

    expect(user1Balance).to.equal(utils.parseEther('10'));
    expect(user2Balance).to.equal(utils.parseEther('10'));
    expect(user3Balance).to.equal(utils.parseEther('10'));
    expect(user4Balance).to.equal(utils.parseEther('10'));

    poolBalance = +(await tokenContract.balanceOf(poolTokenAddress)).toString();
    expect(poolBalance).to.equal(50 * 10 ** 18);

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0x25aD59adbe00C2d80c86d01e2E05e1294DA84823'],
    });

    executor = await hre.ethers.provider.getSigner('0x25aD59adbe00C2d80c86d01e2E05e1294DA84823');
  });

  it('should be successfull', async function () {
    // #region ================= FIRST PERIOD ============================= //

    console.log('\x1b[36m%s\x1b[0m', '#1--- User1 provides 20 units at t0 ');

    erc777 = await ERC777__factory.connect(network_params.superToken, user1);

    await waitForTx(erc777.send(poolTokenAddress, 20000, '0x'));
    t0 = +(await floowdy.poolTimestamp());

    let expedtedPoolBalance = utils.parseEther('50').add(BigNumber.from(20000));

    let periodExpected1: IPERIOD_RESULT = {
      poolTotalBalance: expedtedPoolBalance,
      totalShares: BigNumber.from(20000),
      deposit: BigNumber.from(20000000000),
    };

    user1Balance = await tokenContract.balanceOf(user1.address);
    user2Balance = await tokenContract.balanceOf(user2.address);
    user3Balance = await tokenContract.balanceOf(user2.address);

    let usersTest: Array<{ address: string; name: string; expected: IUSER_RESULT }> = [
      {
        name: 'User1',
        address: user1.address,
        expected: {
          realTimeBalance: BigNumber.from(20000),
          shares: BigNumber.from(20000),
          tokenBalance: utils.parseEther('10').sub(BigNumber.from(20000)),
          deposit: BigNumber.from(20000),
          outAssets: BigNumber.from(0),
          outFlow: BigNumber.from(0),
          inFlow: BigNumber.from(0),
          timestamp: BigNumber.from(0),
        },
      },
    ];

    await testPeriod(BigNumber.from(t0), 0, periodExpected1, contractsTest, usersTest);

    console.log('\x1b[36m%s\x1b[0m', '#1--- Period Tested #######');
    console.log('');

    // #endregion FIST PERIOD

    await setNextBlockTimestamp(hre, t0 + 10);

    // #region ================= SECOND PERIOD ============================= //

    console.log('\x1b[36m%s\x1b[0m', '#2--- User2 provides starts a stream at t0 + 10 ');

    let createFlowOperation = sf.cfaV1.createFlow({
      receiver: poolTokenAddress,
      flowRate: '500',
      superToken: network_params.superToken,
    });
    await createFlowOperation.exec(user2);


    fromUser2Stream = await sf.cfaV1.getFlow({
      superToken: network_params.superToken,
      sender: user2.address,
      receiver: poolTokenAddress,
      providerOrSigner: user2,
    });

    expedtedPoolBalance = utils.parseEther('50').add(BigNumber.from(20000));

    let periodExpected2: IPERIOD_RESULT = {
      poolTotalBalance: expedtedPoolBalance,
      inFlowRate: BigNumber.from(500),
      totalShares: BigNumber.from(20000),
      deposit: BigNumber.from(20000),
      outFlowAssetsRate: BigNumber.from(0),
      outFlowRate: BigNumber.from(0),
      depositInflow: BigNumber.from(0),
    };


    usersTest = [
      {
        name: 'User1',
        address: user1.address,
        expected: {
          realTimeBalance: BigNumber.from(20000),
          shares: BigNumber.from(20000),
          tokenBalance: utils.parseEther('10').sub(BigNumber.from(20000)),
          deposit: BigNumber.from(20000),
          outAssets: BigNumber.from(0),
          outFlow: BigNumber.from(0),
          inFlow: BigNumber.from(0),
          timestamp: BigNumber.from(0),
        },
      },
      {
        name: 'User2',
        address: user2.address,
        expected: {
          realTimeBalance: BigNumber.from(0),
          shares: BigNumber.from(0),
          tokenBalance: utils.parseEther('10').sub(BigNumber.from(+fromUser2Stream.deposit)),
          deposit: BigNumber.from(0),
          outAssets: BigNumber.from(0),
          outFlow: BigNumber.from(0),
          inFlow: BigNumber.from(500),
          timestamp: BigNumber.from(10),
        },
      },
    ];

    await testPeriod(BigNumber.from(t0), 10, periodExpected2, contractsTest, usersTest);

    console.log('\x1b[36m%s\x1b[0m', '#2--- Period Tests passed ');
    console.log('');

    // #endregion SECOND PERIOD

 
      

      await setNextBlockTimestamp(hre, t0 + 20);



  });
});
