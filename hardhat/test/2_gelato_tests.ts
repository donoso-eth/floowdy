import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  initEnv,
  mineBlocks,
  setNextBlockTimestamp,
  waitForTx,
} from '../helpers/utils';
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
  faucet,
  fromBnToNumber,
  getTimestamp,
  increaseBlockTime,
  IPERIOD,
  IPERIOD_RESULT,
  IUSER_CHECK,
  IUSER_RESULT,
  matchEvent,
  prinCredit,
  printUser,
} from './helpers/utils';
import {
  Framework,
  IWeb3FlowInfo,
  SFError,
} from '@superfluid-finance/sdk-core';

import { from, interval } from 'rxjs';
import { ethers } from 'hardhat';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { FloowdyInitStruct } from '../typechain-types/Floowdy';
import { INETWORK_CONFIG } from '../helpers/models';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';
import { encodeResolverArgs, encodeTimeArgs, Module, ModuleData } from './helpers/module';

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
let user5: SignerWithAddress;
let user6: SignerWithAddress;

let executor: any;
let provider: BaseProvider;
let eventsLib: any;
let sf: Framework;

let t0: number;
let ops: IOps;
let erc777: ERC777;
let erc20: ERC20;
let erc20Under: Contract;
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

let ONE_DAY = 24 * 60 * 60;

const processDir = process.cwd();
let networks_config = JSON.parse(
  readFileSync(join(processDir, 'networks.config.json'), 'utf-8')
) as INETWORK_CONFIG;

let network_params = networks_config['goerli'];

describe.only('credit delegation tests', function () {
  beforeEach(async () => {
    await hre.network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          // forking: {
          //   jsonRpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT`,
          //   blockNumber: 28154232, 27282489
          // }
          forking: {
            jsonRpcUrl: `https://goerli.infura.io/v3/1e43f3d31eea4244bf25ed4c13bfde0e`,
            blockNumber: 7631671,
          },
        },
      ],
    });

    [deployer, user1, user2, user3, user4, user5, user6] = await initEnv(hre);
    provider = hre.ethers.provider;
    let floowdy_init: FloowdyInitStruct = {
      host: network_params.host,
      superToken: network_params.superToken,
      token: network_params.token,
      pool: network_params.aavePool,
      aToken: network_params.aToken,
      ops: network_params.ops,
      epnsChannel: network_params.epnsChanel,
      epnsComm: network_params.epnsComm,
    };

    floowdy = await new Floowdy__factory(deployer).deploy(floowdy_init);

    floowdyAddress = floowdy.address;
    console.log(floowdyAddress);
    eventsLib = await new Events__factory(deployer).deploy();

    supertokenContract = await ISuperToken__factory.connect(
      network_params.superToken,
      deployer
    );
    tokenContract = await ERC777__factory.connect(
      network_params.superToken,
      deployer
    );

    let initialPoolEth = hre.ethers.utils.parseEther('10');

    let balance = await provider.getBalance(floowdyAddress);

    await deployer.sendTransaction({
      to: floowdyAddress,
      value: initialPoolEth,
    });
    balance = await provider.getBalance(floowdyAddress);

    console.log(balance)


    erc20Under = new hre.ethers.Contract(
      network_params.token,
      abi_erc20mint,
      deployer
    );

    //let balanceSuper = await erc20Under.balanceOf(deployer.address);

   // await waitForTx(erc20Under['mint(uint256)'](1000000000000));

   // balanceSuper = await erc20Under.balanceOf(deployer.address);

    tokenContract.approve(floowdyAddress, hre.ethers.constants.MaxUint256);

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [network_params.opsExec],
    });

    executor = await hre.ethers.provider.getSigner(network_params.opsExec);
    ops = IOps__factory.connect(network_params.ops, executor);

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
      customSubgraphQueriesEndpoint:
        'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli',
      resolverAddress: network_params.sfResolver,
    });

    erc20 = await ERC20__factory.connect(network_params.superToken, user1);
    // await waitForTx(erc20.increaseAllowance(floowdyAddress, hre.ethers.utils.parseEther("500")))

    /////// Cleaning and preparing init state /////////

    let amountInit = utils.parseEther('5');
    //await tokenContract.transfer(floowdyAddress, amountInit);

    

    await faucet(
      user1,
      erc20Under,
      network_params.superToken,
      supertokenContract
    );
   

  });


  it('should be successfull', async function () {

    t0 = +(await getTimestamp());
    console.log(t0)
    // #region ================= FIRST PERIOD ============================= //

    console.log('\x1b[36m%s\x1b[0m', '#1--- User1 provides 20 units at t0 ');


    console.log(
      '\x1b[36m%s\x1b[0m',
      '#2--- User2 provides starts a stream at t0 + 10 '
    );

    user1Balance = await tokenContract.balanceOf(user1.address);

    let data = utils.defaultAbiCoder.encode(
      ['uint256'],
      [3600]
    );
      
    let createFlowOperation = sf.cfaV1.createFlow({
      receiver: floowdyAddress,
      flowRate: '3858024691358',
      superToken: network_params.superToken,
      userData:data,
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

    console.log(fromUser2Stream)

  await printUser(floowdy, user1.address);

    console.log('\x1b[36m%s\x1b[0m', '#2--- Period Tests passed ');
    console.log('');

    // #endregion SECOND PERIOD

    await printUser(floowdy, user1.address);
    console.log(t0)

    await setNextBlockTimestamp(hre, t0 + 3610);



    //// GELATO stop stream


    execData = floowdy.interface.encodeFunctionData('stopStreamExec', [
     user1.address
    ]);
    execSelector = floowdy.interface.getSighash(
      'stopStreamExec(address)'
    );

    resolverAddress = floowdyAddress;
    resolverData = await floowdy.interface.encodeFunctionData(
      'checkStopStream',
      [user1.address]
    );
    // bytes4(utils.keccak256(bytes('stopCreditPeriodExec(uint256)')));

    resolverHash = utils.keccak256(
      new utils.AbiCoder().encode(
        ['address', 'bytes'],
        [resolverAddress, resolverData]
      )
    );



    let id = utils.keccak256(
      new utils.AbiCoder().encode(
        ['address', 'address', 'bytes4', 'bool', 'address', 'bytes32'],
        [floowdyAddress, floowdyAddress, execSelector, false, ETH, resolverHash]
      )
    );

    console.log(id)
    console.log(t0+3600);
      let fee = utils.parseEther("0.1")
      const moduleData: ModuleData = {
        modules: [Module.RESOLVER, Module.TIME],
        args: [
          encodeResolverArgs(floowdyAddress, resolverData),
          encodeTimeArgs(1663412276, 600),
        ],
      };


  //    await waitForTx(floowdy.connect(user1).stopStream({gasLimit:100000}))

   await   ops.connect(executor).exec(floowdyAddress,floowdyAddress,execData,moduleData,fee,ETH,false,true)



    fromUser2Stream = await sf.cfaV1.getFlow({
      superToken: network_params.superToken,
      sender: user1.address,
      receiver: floowdyAddress,
      providerOrSigner: user1,
    });

    console.log(fromUser2Stream)

    await printUser(floowdy, user1.address);

  });
});
