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

  await faucet(
    user2,
    erc20Under,
    network_params.superToken,
    supertokenContract
  )

  await faucet(
    user3,
    erc20Under,
    network_params.superToken,
    supertokenContract
  );
  await faucet(
    user4,
    erc20Under,
    network_params.superToken,
    supertokenContract
  );
  await faucet(
    user5,
    erc20Under,
    network_params.superToken,
    supertokenContract
  );
  await faucet(
    user6,
    erc20Under,
    network_params.superToken,
  supertokenContract
);

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

task('usecase-1', 'use-case-1').setAction(async ({}, hre) => {


  // await hre.network.provider.request({
  //   method: 'hardhat_reset',
  //   params: [
  //     {
  //       // forking: {
  //       //   jsonRpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT`,
  //       //   blockNumber: 28154232,
  //       // }
  //       forking: {
  //         jsonRpcUrl: `https://goerli.infura.io/v3/1e43f3d31eea4244bf25ed4c13bfde0e`,
  //         blockNumber: 7631671,
  //       },
  //     },
  //   ],
  // });

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
) 



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

await waitForTx(
  supertokenContract.connect(user2).send(floowdyAddress, amount, '0x')
  )

  await waitForTx(
    supertokenContract.connect(user3).send(floowdyAddress, amount, '0x')
    )

  await waitForTx(
    supertokenContract.connect(user4).send(floowdyAddress, amount, '0x')
    )

await printPool(hre,floowdy)



//    await waitForTx(floowdy.connect(user1).stopStream({gasLimit:100000}))


await printPool(hre,floowdy)



 await hre.run('gelato-aave',{interval: 30 * 24 * 3600})

//await waitForTx(floowdy.poolRebalance());

await printPool(hre,floowdy)

// let user1Balance = await floowdy._getMemberAvailable(user1.adress)
// console.log(user1Balance.toString())

let pool = IPool__factory.connect(network_params.aavePool, user1);

let creditReQuest: CreditRequestOptionsStruct = {
  amount:1000000000,
  rateAave:3,
  ratePool:4,
  nrInstallments:12,
  interval:3600,
  handle:'javier',
  bio:'javier'
}

await waitForTx(floowdy.connect(user1).requestCredit(creditReQuest));

await hre.run('gelato-aave',{interval: 30 * 24 * 3600})

t0 = +(await getTimestamp(hre));
await waitForTx(
  supertokenContract.connect(deployer).send(floowdyAddress, amount  ,'0x')
);

t0 = +(await getTimestamp(hre));

let result = await pool.getUserAccountData(floowdyAddress)


// await floowdy.checkDelegation(1000000000)
// await hre.run('gelato-aave',{interval: 30 * 24 * 3600})

// throw new Error("");


await waitForTx(floowdy.connect(user2).creditCheckIn(creditNr));
t0 = +(await getTimestamp(hre));

console.log(typeof(t0));

 await hre.run('gelato-phases',{interval:600, credit:creditNr, t0:t0})


await waitForTx(floowdy.connect(user1).creditApproved(creditNr));


await waitForTx(debtToken.connect(user1).approve(floowdyAddress, constants.MaxUint256));



let balancedai = await debtToken.balanceOf(user1.address) 
console.log(285,balancedai.toString())

await waitForTx(pool.borrow(network_params.debtToken,1000*10**6,1,0,floowdyAddress));

balancedai = await debtToken.balanceOf(user1.address) 


// 83340182
// 800000000

// 83340182
// 500000000
balance = await hre.ethers.provider.getBalance(floowdyAddress);


await  waitForTx(debtToken.connect(user1)["mint(uint256)"](2000000000000))


for (let i = 0;i<12; i++) {
t0 = +(await getTimestamp(hre)) + (i)*3600
console.log(311,i)
await hre.run('gelato-repay',{interval:3600,credit:creditNr,t0})
}

await waitForTx(
  supertokenContract.connect(user4).send(floowdyAddress, amount, '0x')
  )
  await hre.run('gelato-aave',{interval: 30 * 24 * 3600})
  await waitForTx(
    supertokenContract.connect(user5).send(floowdyAddress, amount, '0x')
    )
    await hre.run('gelato-aave',{interval: 30 * 24 * 3600})

creditNr = 2;

 creditReQuest = {
  amount:3000000000,
  rateAave:3,
  ratePool:4,
  nrInstallments:12,
  interval:3600,
  handle:'javier',
  bio:'javier'
}

await waitForTx(floowdy.connect(user3).requestCredit(creditReQuest));

await waitForTx(floowdy.connect(user4).creditCheckIn(creditNr));
t0 = +(await getTimestamp(hre));

await hre.run('gelato-phases',{interval:600, credit:creditNr, t0:t0})


await waitForTx(
  supertokenContract.connect(user5).send(floowdyAddress, amount, '0x')
  )
  await hre.run('gelato-aave',{interval: 30 * 24 * 3600})

creditNr = 3;

creditReQuest = {
amount:1000000000,
rateAave:3,
ratePool:4,
nrInstallments:12,
interval:3600,
handle:'javier',
bio:'javier'
}

await waitForTx(floowdy.connect(user4).requestCredit(creditReQuest));

await waitForTx(floowdy.connect(user3).creditCheckIn(creditNr));
t0 = +(await getTimestamp(hre));

await hre.run('gelato-phases',{interval:600, credit:creditNr, t0:t0})


});
