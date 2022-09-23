import { readFileSync } from 'fs-extra';
import { task, types } from 'hardhat/config';
import { getTimestamp, initEnv, setNextBlockTimestamp, waitForTx } from '../helpers/utils';
import { join } from 'path';
import { constants , utils, Signer} from 'ethers';
import { Floowdy, Floowdy__factory, IERC20, IPool, ISuperToken, ISuperToken__factory } from '../typechain-types';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';
import { abi_pool } from '../helpers/abis/pool';
import { abi_aerc20 } from '../helpers/abis/aERC20';

import { INETWORK_CONFIG } from '../helpers/models';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as internal from 'stream';
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };




task('advance-time', 'advanceTime')
.addOptionalParam('interval', 'interval', false, types.boolean)
.addOptionalParam('phase', '', false, types.boolean)
.setAction(async (taskArgs, hre) => {
  // throw new Error("");
  
let advanceTime = 24 * 3600 * 30;

if (taskArgs.interval == true) {
  advanceTime = 3600;
} else if (taskArgs.phase == true) {
  advanceTime = 600;
}
//const  [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]= await initEnv(hre); console.log(user1.address);
let t0 = +(await getTimestamp(hre));
await setNextBlockTimestamp(hre, t0 + advanceTime);


});
