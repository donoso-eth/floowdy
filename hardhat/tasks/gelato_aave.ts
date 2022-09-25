import { readFileSync } from 'fs-extra';
import { task, types } from 'hardhat/config';
import {
  getTimestamp,
  initEnv,
  setNextBlockTimestamp,
  waitForTx,
} from '../helpers/utils';
import { join } from 'path';
import { constants, utils, Signer } from 'ethers';
import {
  Floowdy,
  Floowdy__factory,
  IERC20,
  IOps__factory,
  IPool,
  ISuperToken,
  ISuperToken__factory,
} from '../typechain-types';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';
import { abi_pool } from '../helpers/abis/pool';
import { abi_aerc20 } from '../helpers/abis/aERC20';

import { INETWORK_CONFIG } from '../helpers/models';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as internal from 'stream';
import {
  encodeResolverArgs,
  encodeTimeArgs,
  Module,
  ModuleData,
} from '../helpers/module';
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };

const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

task('gelato-aave', 'push to AAVE')
  .addParam('interval', '', 24 * 30 * 3600, types.int)
  .setAction(async (taskArgs, hre) => {
    let interval = taskArgs.interval;

    //const  [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]= await initEnv(hre); console.log(user1.address);
  

    const [
      deployer

    ] = await initEnv(hre);
   
    let deployContract = 'floowdy';
    let toDeployContract = contract_config[deployContract];
    const floodyJson = JSON.parse(
      readFileSync(
        `${contract_path}/${toDeployContract.jsonName}_metadata.json`,
        'utf-8'
      )
    );

    let floowdyAddress = floodyJson.address;

    let floowdy: Floowdy = Floowdy__factory.connect(floowdyAddress, deployer);

    let networks_config = JSON.parse(
      readFileSync(join(processDir, 'networks.config.json'), 'utf-8')
    ) as INETWORK_CONFIG;

    let network_params = networks_config['goerli'];

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [network_params.opsExec],
    });

    let executor = await hre.ethers.provider.getSigner(network_params.opsExec);
    let ops = IOps__factory.connect(network_params.ops, executor);

    let execData;
    let execAddress;
    let execSelector;
    let resolverAddress;
    let resolverData;
    let resolverHash;

    execData = floowdy.interface.encodeFunctionData('supplyStakeToAave');
    execSelector = floowdy.interface.getSighash('supplyStakeToAave()');

    resolverAddress = floowdyAddress;
    resolverData = await floowdy.interface.encodeFunctionData(
      'checkStakeAvailable'
    );

    resolverHash = utils.keccak256(
      new utils.AbiCoder().encode(
        ['address', 'bytes'],
        [resolverAddress, resolverData]
      )
    );

    let fee = utils.parseEther('0.1');
    let moduleData: ModuleData = {
      modules: [Module.RESOLVER],
      args: [encodeResolverArgs(hre, floowdyAddress, resolverData)],
    };
  
    let canExec = (await floowdy.checkStakeAvailable())[0]
    console.log('XXXXXXXXXXXXXXXXx')
     console.log(canExec)
    //    await waitForTx(floowdy.connect(user1).stopStream({gasLimit:100000}))
    if (canExec== true) {
    await ops
      .connect(executor)
      .exec(
        floowdyAddress,
        floowdyAddress,
        execData,
        moduleData,
        fee,
        ETH,
        false,
        true
      );
      }

      let t0 = +(await getTimestamp(hre));
      await setNextBlockTimestamp(hre, t0 + interval);

  });
