import { Floowdy } from '../typechain-types';
import { HardhatNetworkAccountConfig, HardhatNetworkAccountsConfig, HardhatNetworkConfig, HardhatRuntimeEnvironment } from 'hardhat/types';
import { MemberStructOutput, PoolStructOutput } from '../typechain-types/Events';

export const printPool= async (hre:HardhatRuntimeEnvironment, floowdy:Floowdy) => {

     let poolTimestamp = +(await floowdy.poolTimestamp()).toString();


let pool:PoolStructOutput = await floowdy.poolByTimestamp(poolTimestamp);

  console.log('\x1b[36m%s\x1b[0m', 'XXXXXXXXXXXXXXXXXXXX   PERIOD    XXXXXXXXXXXXXXXXXXXXX');
  console.log(`ID ${+pool.id.toString()} `);
  console.log(`TimeStamp ${+pool.timestamp.toString()} `);
  console.log(`DEPOSIT ${pool.totalDeposit.toString()}`);
  console.log(`In-Flow ${pool.totalFlow.toString()}  units/s`);
  console.log(`Staked ${pool.totalStaked.toString()}  units/s`);
  console.log(`Yiel from Stake ${pool.totalYieldStake.toString()}  units/s`);
//   console.log(`Deposit From InFlow ${period.depositFromInFlowRate.toString()}  units`);
//   console.log(`Deposit From OutFlow ${period.depositFromOutFlowRate.toString()}  units`);
//   console.log(`Deposit ${period.deposit.toString()}  units`);
   console.log(`Index Deposit: ${pool.depositIndex.toString()}  units`);
//   console.log(`IndexYieldInFlowrate: ${period.yieldInFlowRateIndex.toString()}  units`);
//   console.log(`IndexYieldOutFlowrate: ${period.yieldOutFlowRateIndex.toString()}  units`);
//   console.log(`Yield Per Second: ${period.yieldAccruedSec.toString()}  units`);
  console.log('\x1b[36m%s\x1b[0m', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');


}

export const printUser = async (floowdy: Floowdy, userAddress: string): Promise<any> => {
    let user = await floowdy.members(userAddress) as MemberStructOutput;
    console.log(user);
    console.log('\x1b[32m%s\x1b[0m', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.log(`Id ${user.id.toString()} `);
    console.log(`User ${user.member.toString()} `);
    console.log(`DEPOSIT ${user.deposit} units,`);
    console.log(`Flow  ${user.flow} units/s,`);
    console.log(`Flow Duration  ${user.flowDuration} s,`);
    console.log(`Deposit Gelato Task Id ${user.flowGelatoId.toString()}`);
    console.log(`Creted TimeStamp ${user.initTimestamp.toString()}`);
    console.log(`TimeStamp ${user.timestamp.toString()}`);
    console.log(`Cumulative Yield: ${user.yieldAccrued.toString()}  units`);
    console.log(`Amount Locked: ${user.amountLocked.toString()}  units`);
    console.log('\x1b[32m%s\x1b[0m', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  
    return user;
  };
  