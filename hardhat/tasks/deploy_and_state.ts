import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { getTimestamp, initEnv, setNextBlockTimestamp, waitForTx } from '../helpers/utils';
import { join } from 'path';
import { constants , utils, Signer} from 'ethers';
import { Floowdy, Floowdy__factory, IERC20, IOps__factory, IPool, ISuperToken, ISuperToken__factory } from '../typechain-types';
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

const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
 const faucet = async (user:SignerWithAddress,erc20Under:any,superToken:string,supertokenContract: ISuperToken  ) =>{

  await  waitForTx(erc20Under.connect(user)["mint(uint256)"](1000000000000))

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

  await faucet(
    user2,
    erc20Under,
    network_params.superToken,
    supertokenContract
  )

//   await faucet(
//     user3,
//     erc20Under,
//     network_params.superToken,
//     supertokenContract
//   );
//   await faucet(
//     user4,
//     erc20Under,
//     network_params.superToken,
//     supertokenContract
//   );
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

task('deploy-state', 'create state').setAction(async ({}, hre) => {
  // throw new Error("");
  
//const  [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]= await initEnv(hre); console.log(user1.address);

execSync("npm run deploy",{encoding: "utf8",stdio: 'inherit'})
console.log('.....deployed')
execSync("npm run task publish -- --only-address true",{encoding: "utf8",stdio: 'inherit'})
console.log('.....publish to subgraph')
execSync("npm run deploy-graph-local",{encoding: "utf8",stdio: 'inherit'})
console.log('.....graph deployed')



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
 
let execData;
let execAddress;
let execSelector;
let resolverAddress;
let resolverData;
let resolverHash;

 let supertokenContract = await ISuperToken__factory.connect(
  network_params.superToken,
  deployer
);


let token = new hre.ethers.Contract(
  network_params.token,
  abi_erc20mint,
  deployer
);
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


await hre.network.provider.request({
  method: 'hardhat_impersonateAccount',
  params: [network_params.opsExec],
});

let executor = await hre.ethers.provider.getSigner(network_params.opsExec);
let ops = IOps__factory.connect(network_params.ops, executor);


let creditNr = 1;

if(creditNr == 1){
await doAllFaucet(erc20Under, supertokenContract, network_params,deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10)
}

let amount = utils.parseEther("20000")


await waitForTx(
supertokenContract.connect(user1).send(floowdyAddress, amount, '0x')
)

let creditReQuest: CreditRequestOptionsStruct = {
  amount:1000000000,
  rate:5,
  nrInstallments:12,
  interval:3600,
  handle:'javier',
  bio:'javier'
}
let t0 = +(await getTimestamp(hre));
await waitForTx(floowdy.connect(user1).requestCredit(creditReQuest));

await waitForTx(
  supertokenContract.connect(deployer).send(floowdyAddress, amount  ,'0x')
);


await waitForTx(floowdy.connect(deployer).creditCheckIn(creditNr));

console.log(t0)

await setNextBlockTimestamp(hre, t0 + 4000);


execData = floowdy.interface.encodeFunctionData('stopCreditPeriodExec', [
  creditNr
 ]);
 execSelector = floowdy.interface.getSighash(
   'stopCreditPeriodExec(uint256)'
 );

 resolverAddress = floowdyAddress;
 resolverData = await floowdy.interface.encodeFunctionData(
   'checkCreditPeriod',
   [creditNr]
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

 console.log(t0)
 console.log(t0+3600);
   let fee = utils.parseEther("0.1")
   const moduleData: ModuleData = {
     modules: [Module.RESOLVER, Module.TIME],
     args: [
       encodeResolverArgs(hre,floowdyAddress, resolverData),
       encodeTimeArgs(hre,t0+1, 600),
     ],
   };


//    await waitForTx(floowdy.connect(user1).stopStream({gasLimit:100000}))

await   ops.connect(executor).exec(floowdyAddress,floowdyAddress,execData,moduleData,fee,ETH,false,true)





// await waitForTx(
//   supertokenContract.connect(user2).send(floowdyAddress, amount , '0x')
// );
// await waitForTx(floowdy.connect(user2).creditCheckIn(creditNr));

// await waitForTx(
//   supertokenContract.connect(user3).send(floowdyAddress, amount.mul(3) , '0x')
// );
// await waitForTx(floowdy.connect(user3).creditCheckIn(creditNr));

// await waitForTx(
//   supertokenContract.connect(user4).send(floowdyAddress,amount.mul(2) , '0x')
// );
// await waitForTx(floowdy.connect(user4).creditCheckIn(creditNr));
 
// await waitForTx(
//   supertokenContract.connect(user5).send(floowdyAddress, 2 * amount  '0x')
// );
// await waitForTx(floowdy.connect(user5).creditCheckIn(creditNr));
 
//await  waitForTx(floowdy.stopCreditPeriodExec(creditNr));


});
