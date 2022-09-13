// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { writeFileSync,readFileSync } from "fs";
import {copySync, ensureDir,existsSync } from 'fs-extra'
import { ethers,hardhatArguments } from "hardhat";
import config from "../hardhat.config";
import { join } from "path";
import { createHardhatAndFundPrivKeysFiles } from "../helpers/localAccounts";
import * as hre from 'hardhat';
import { abi_erc20mint } from "../helpers/abis/ERC20Mint";
import { initEnv, waitForTx } from "../helpers/utils";
import { Flowdy__factory } from "../typechain-types";


interface ICONTRACT_DEPLOY {
  artifactsPath:string,
  name:string,
  ctor?:any,
  jsonName:string
}

const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
ensureDir(contract_path)




let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as 
{ [key:string]:{ ops:string, host:string, token:string, superToken:string, aavePool:string, aToken:string}}


async function main() {

  const [deployer] = await initEnv(hre);

  let network = hardhatArguments.network;
  if (network == undefined) {
    network = config.defaultNetwork as string; 
  }

  const contract_config = JSON.parse(readFileSync( join(processDir,'contract.config.json'),'utf-8')) as {[key:string]: ICONTRACT_DEPLOY}
  

   

  let network_params = networks_config[network];

if (network == "localhost") {
  network_params = networks_config["goerli"];
}

if (network_params == undefined) {
  throw new Error("NETWORK UNDEFINED");
  
}



  //// DEPLOY POOLFACTORY

  const flowdy = await new Flowdy__factory(deployer).deploy(
    network_params.host,
    network_params.superToken,
    network_params.token,
    network_params.aavePool,
    network_params.aToken,
    network_params.ops
    )

  let toDeployContract = contract_config['flowdy'];
  
  if (toDeployContract == undefined) {
      console.error('Your contract is not yet configured');
      console.error(
        'Please add the configuration to /hardhat/contract.config.json'
      );
      return;
    }
    const artifactsPath = join(
      processDir,
      `./artifacts/contracts/${toDeployContract.artifactsPath}`
    );
    const Metadata = JSON.parse(readFileSync(artifactsPath, 'utf-8'));

   
    //const signer:Signer = await hre.ethers.getSigners()

    writeFileSync(
      `${contract_path}/${toDeployContract.jsonName}_metadata.json`,
      JSON.stringify({
        abi: Metadata.abi,
        name: toDeployContract.name,
        address: flowdy.address,
        network: network,
      })
    );

    console.log(
      toDeployContract.name + ' Contract Deployed to:',
      flowdy.address
    );

    ///// copy Interfaces and create Metadata address/abi to assets folder
    copySync(
      `./typechain-types/${toDeployContract.name}.ts`,
      join(contract_path, 'interfaces', `${toDeployContract.name}.ts`)
    );

    let erc20 = new ethers.Contract(
      '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',abi_erc20mint,
      deployer
    );

    let balance = await erc20.balanceOf(flowdy.address)
    console.log(balance)
    let amount = "100000000";
    await waitForTx(erc20["mint(address,uint256)"]( flowdy.address,amount ))
 
    balance = await erc20.balanceOf(flowdy.address)
    console.log(balance)


  

  ///// create the local accounts file
  if (
    !existsSync(`${contract_path}/local_accouts.json`) &&
    (network == 'localhost' || network == 'hardhat')
  ) {
    const accounts_keys = await createHardhatAndFundPrivKeysFiles(
      hre,
      contract_path
    );
    writeFileSync(
      `${contract_path}/local_accouts.json`,
      JSON.stringify(accounts_keys)
    );
  }

 
  ///// copy addressess files
  if (!existsSync(`${contract_path}/interfaces/common.ts`)) {
    copySync(
      './typechain-types/common.ts',
      join(contract_path, 'interfaces', 'common.ts')
    );
  }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
