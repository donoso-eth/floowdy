import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { initEnv } from '../helpers/utils';
import { join } from 'path';
import { FloowdyInitStruct } from '../typechain-types/Floowdy';
import { INETWORK_CONFIG } from 'hardhat/helpers/models';

const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd();
const contract_path = join(processDir, contract_path_relative);
const contract_config = JSON.parse(
  readFileSync(join(processDir, 'contract.config.json'), 'utf-8')
) as { [key: string]: any };

task('verify-contract', 'verify').setAction(async ({}, hre) => {
  let deployContract = 'floowdy';
  let toDeployContract = contract_config[deployContract];
  const linkApp = JSON.parse(
    readFileSync(
      `${contract_path}/${toDeployContract.jsonName}_metadata.json`,
      'utf-8'
    )
  );

  let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as INETWORK_CONFIG;

//  '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F' ops address

      let   network_params = networks_config["goerli"];

  const [deployer] = await initEnv(hre);
  let floodyInit:FloowdyInitStruct = {
    host:network_params.host,
    superToken:network_params.superToken,
    token:network_params.token,
    stableDebtToken: network_params.aStableDebtToken,
    debtToken:network_params.debtToken,
    pool:network_params.aavePool,
    aToken:network_params.aToken,
    ops:network_params.ops,
    epnsComm:network_params.epnsComm,
    epnsChannel:network_params.epnsChanel
  }
  console.log(deployer.address);
  console.log(linkApp.address);
  await hre.run('verify:verify', {
    address: linkApp.address,
    constructorArguments: [
floodyInit  ],
  });
});
