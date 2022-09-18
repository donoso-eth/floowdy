import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { initEnv, waitForTx } from '../helpers/utils';
import { join } from 'path';
import { constants , utils, Signer} from 'ethers';
import { Floowdy, Floowdy__factory, IERC20, IPool, ISuperToken, ISuperToken__factory } from '../typechain-types';
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

 const faucet = async (user:SignerWithAddress,erc20Under:any,superToken:string,supertokenContract: ISuperToken  ) =>{

  await  waitForTx(erc20Under.connect(user)["mint(uint256)"](1000000000000))

  await erc20Under.connect(user).approve(superToken, constants.MaxInt256)
  let amountSuper = utils.parseEther("1000000")
  await waitForTx(supertokenContract.connect(user).upgrade(amountSuper))
  let userBalance = await supertokenContract.balanceOf(user.address);
  console.log(user.address, userBalance.toString())
}

task('mockState', 'mock state').setAction(async ({}, hre) => {
 const  [deployer, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]= await initEnv(hre); console.log(user1.address);
 // throw new Error("");
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

let   network_params = networks_config["goerli"];
 

 let   supertokenContract = await ISuperToken__factory.connect(
  network_params.superToken,
  deployer
);


let erc20Under = new hre.ethers.Contract(
  network_params.token,
  abi_erc20mint,
  deployer
);

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
  );
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

await faucet(
  user7,
  erc20Under,
  network_params.superToken,
supertokenContract
);

await faucet(
  user8,
  erc20Under,
  network_params.superToken,
supertokenContract
);

await faucet(
  user9,
  erc20Under,
  network_params.superToken,
supertokenContract
);
await faucet(
  user10,
  erc20Under,
  network_params.superToken,
supertokenContract
);


let creditNr = 1;

await waitForTx(
supertokenContract.connect(deployer).send(floowdyAddress, 20000, '0x')
)

await waitForTx(floowdy.connect(deployer).requestCredit(20000));

await waitForTx(
  supertokenContract.connect(user1).send(floowdyAddress, 20000, '0x')
);
await waitForTx(floowdy.connect(user1).creditCheckIn(creditNr));



await waitForTx(
  supertokenContract.connect(user2).send(floowdyAddress, 40000, '0x')
);
await waitForTx(floowdy.connect(user2).creditCheckIn(creditNr));

await waitForTx(
  supertokenContract.connect(user3).send(floowdyAddress, 40000, '0x')
);
await waitForTx(floowdy.connect(user3).creditCheckIn(creditNr));

await waitForTx(
  supertokenContract.connect(user4).send(floowdyAddress, 40000, '0x')
);
await waitForTx(floowdy.connect(user4).creditCheckIn(creditNr));
 
await waitForTx(
  supertokenContract.connect(user5).send(floowdyAddress, 40000, '0x')
);
await waitForTx(floowdy.connect(user5).creditCheckIn(creditNr));
 
await  waitForTx(floowdy.stopCreditPeriodExec(creditNr));


});
