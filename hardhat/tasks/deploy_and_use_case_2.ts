import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { getTimestamp, initEnv, setNextBlockTimestamp, waitForTx } from '../helpers/utils';
import { join } from 'path';
import { constants , utils, Signer} from 'ethers';
import { Floowdy, Floowdy__factory, IERC20, IOps__factory, IPool, IPool__factory, ISuperToken, ISuperToken__factory } from '../typechain-types';
import { abi_erc20mint } from '../helpers/abis/ERC20Mint';
import { abi_pool } from '../helpers/abis/pool';
import { abi_aerc20 } from '../helpers/abis/aERC20';

import { INETWORK_CONFIG } from '../helpers/models';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };

import { encodeResolverArgs, encodeTimeArgs, Module, ModuleData } from '../helpers/module';

import {  execSync} from 'child_process'
import { CreditRequestOptionsStruct } from '../typechain-types/Floowdy';
import { printPool } from '../helpers/print';

const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
 const faucet = async (user:SignerWithAddress,erc20Under:any,superToken:string,supertokenContract: ISuperToken  ) =>{

  await  waitForTx(erc20Under.connect(user)["mint(uint256)"](2000000000000))

  await erc20Under.connect(user).approve(superToken, constants.MaxInt256)
  let amountSuper = utils.parseEther("1000000")
  await waitForTx(supertokenContract.connect(user).upgrade(amountSuper))
  let userBalance = await supertokenContract.balanceOf(user.address);
  console.log(user.address, userBalance.toString())
}


const doAllFaucet= async (erc20Under:any, supertokenContract:any, network_params:any,deployer:any, user1:any, user2:any, user3:any, user4:any, user5:any, user6:any, user7:any, user8:any, user9:any, user10:any)  => {
  await faucet(
    deployer,
    erc20Under,
    network_params.superToken,
    supertokenContract
  );


  await faucet(
    user1,
    erc20Under,
    network_params.superToken,
    supertokenContract
  );


//   await faucet(
//     user5,
//     erc20Under,
//     network_params.superToken,
//     supertokenContract
//   );
//   await faucet(
//     user6,
//     erc20Under,
//     network_params.superToken,
//   supertokenContract
// );

// await faucet(
//   user7,
//   erc20Under,
//   network_params.superToken,
// supertokenContract
// );

// await faucet(
//   user8,
//   erc20Under,
//   network_params.superToken,
// supertokenContract
// );

// await faucet(
//   user9,
//   erc20Under,
//   network_params.superToken,
// supertokenContract
// );
// await faucet(
//   user10,
//   erc20Under,
//   network_params.superToken,
// supertokenContract
// );
}

task('usecase-2', 'use-case-2').setAction(async ({}, hre) => {

execSync("npm run deploy",{encoding: "utf8",stdio: 'inherit'})

console.log('.....deployed')
// execSync("npm run task publish -- --only-address true",{encoding: "utf8",stdio: 'inherit'})
// console.log('.....publish to subgraph')
// execSync("npm run deploy-graph-local",{encoding: "utf8",stdio: 'inherit'})
// console.log('.....graph deployed')



const  [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]= await initEnv(hre); console.log(user1.address);


 let deployContract = 'floowdy';
 let toDeployContract = contract_config[deployContract];
 const floodyJson = JSON.parse(
   readFileSync(
     `${contract_path}/${toDeployContract.jsonName}_metadata.json`,
     'utf-8'
   )
 );

 let floowdyAddress = floodyJson.address

 let floowdy:Floowdy = Floowdy__factory.connect(floowdyAddress, user1);

 let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as INETWORK_CONFIG;

let network_params = networks_config["goerli"];
 

 let supertokenContract = await ISuperToken__factory.connect(
  network_params.superToken,
  deployer
);


let token = new hre.ethers.Contract(
  network_params.token,
  abi_erc20mint,
  deployer
) as IERC20;

let debtToken = new hre.ethers.Contract(
  network_params.debtToken,
  abi_erc20mint,
  deployer
) as IERC20;



let erc20Under = new hre.ethers.Contract(
  network_params.token,
  abi_erc20mint,
  deployer
);

let initialPoolEth = hre.ethers.utils.parseEther('10');

let balance = await hre.ethers.provider.getBalance(floowdyAddress);

await deployer.sendTransaction({
  to: floowdyAddress,
  value: initialPoolEth,
});
balance = await hre.ethers.provider.getBalance(floowdyAddress);

console.log(balance)



let creditNr = 1;

if(creditNr == 1){
await doAllFaucet(erc20Under, supertokenContract, network_params,deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10)
}

let amount = utils.parseEther("250000")
let t0 = +(await getTimestamp(hre));


// let pool_aave = await floowdy.getAaveData();
// console.log(pool_aave)

await printPool(hre,floowdy)

await waitForTx(
supertokenContract.connect(user1).send(floowdyAddress, amount, '0x')
)
await printPool(hre,floowdy)


await printPool(hre,floowdy)





 await hre.run('gelato-aave',{interval: 364 * 24 * 3600})

//await waitForTx(floowdy.poolRebalance());

await printPool(hre,floowdy)

let amount5 = utils.parseEther("50000")

await waitForTx(floowdy.memberWithdraw(amount5))

console.log('55555555555555')

});
