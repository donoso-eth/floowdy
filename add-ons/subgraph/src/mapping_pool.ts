// #region =========== MEMBER =================

import {  PoolUpdated } from "../generated/Floowdy/Floowdy";
import { Pool } from "../generated/schema";


export function handlePoolUpdated(event:PoolUpdated):void {
    _updatePool(event)
  }
  

  function _updatePool(event: PoolUpdated):void {
    let id = event.params.pool.timestamp.toHexString();
   
    let pool= _getPool(id)
    pool.poolId=   event.params.pool.id.toString();
    pool.totalDeposit = event.params.pool.totalDeposit;
    pool.timestamp = event.params.pool.timestamp;
    pool.totalFlow = event.params.pool.totalFlow;
    pool.totalYield=  event.params.pool.totalYield;
    pool.totalDelegated =  event.params.pool.totalDelegated;
    pool.depositIndex =  event.params.pool.depositIndex;
    pool.flowIndex =  event.params.pool.flowIndex
    pool.totalMembers= event.params.pool.totalMembers
    pool.save()
  }
  
  
  function _getPool( id:string): Pool {
  
      let pool = Pool.load(id);
      if (pool=== null) {
        pool= new Pool(id);
        pool.save();
      }
      return pool;
    }
  
    
  // #endregion =========== MEMBER =================
  