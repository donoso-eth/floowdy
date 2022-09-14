import { readFileSync } from 'fs-extra';
import { task } from 'hardhat/config';
import { initEnv } from '../helpers/utils';
import { join } from 'path';

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

  let networks_config = JSON.parse(readFileSync( join(processDir,'networks.config.json'),'utf-8')) as 
  { [key:string]:{ ops:string, host:string, token:string, superToken:string, aavePool:string, aToken:string}}
  
  

//  '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F' ops address

      let   network_params = networks_config["goerli"];

  const [deployer] = await initEnv(hre);

  console.log(deployer.address);
  console.log(linkApp.address);
  await hre.run('verify:verify', {
    address: linkApp.address,
    constructorArguments: [
      network_params.host,
      network_params.superToken,
      network_params.token,
      network_params.aavePool,
      network_params.aToken,
      network_params.ops
     ],
  });
});
