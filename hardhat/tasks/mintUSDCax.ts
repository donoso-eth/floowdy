import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { initEnv, waitForTx } from '../helpers/utils';
import { join } from 'path';
import { constants } from 'ethers';
import { IERC20, IPool } from '../typechain-types';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';
import { abi_pool } from '../helpers/abis/pool';
import { abi_aerc20 } from '../helpers/abis/aERC20';

const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };

task('mint-usdc-aave', 'mint usdc aave').setAction(async ({}, hre) => {
  const [deployer] = await initEnv(hre);

  console.log(deployer.address);
 // throw new Error("");
  

  let erc20 = new hre.ethers.Contract(
    '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',abi_erc20mint,
    deployer
  );

    console.log(erc20.address);
    console.log(222)


  // let balance = await erc20.balanceOf(deployer.address);

  // console.log(balance.toString());
     let amount = "1000000";
   await waitForTx(erc20["mint(uint256)"](amount ))

  //  await waitForTx(erc20["approve"](amount ))

   let pool = new hre.ethers.Contract("0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",abi_pool, deployer) as IPool
   
 await waitForTx(erc20["approve"]("0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",amount ))
  await waitForTx(pool.supply('0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',amount,deployer.address,0,{gasLimit:1000000}))
  

  let aaveerc20 = new hre.ethers.Contract("0x1Ee669290939f8a8864497Af3BC83728715265FF",abi_aerc20,deployer) as IERC20;

  let balance = (await aaveerc20.balanceOf(deployer.address));
  console.log(balance.toString())

});
