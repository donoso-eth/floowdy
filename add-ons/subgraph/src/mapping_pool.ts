// #region =========== MEMBER =================

import {  PoolUpdated } from "../generated/Floowdy/Floowdy";
import { ChartMonth, Pool } from "../generated/schema";
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handlePoolUpdated(event:PoolUpdated):void {
    _updatePool(event)
  }
  

  function _updatePool(event: PoolUpdated):void {
    let id = event.params.pool.id.toString();
   
    let pool= _getPool(id)

    pool.apy = BigInt.fromI32(0);
    pool.apySpan = BigInt.fromI32(0);

    if (id == "1") {
      pool.apy = BigInt.fromI32(0);
      pool.apySpan = BigInt.fromI32(0);
    } else {
      let lastId = event.params.pool.id.minus(BigInt.fromI32(1));
      let lastPool = _getPool(lastId.toString())

    

      pool.apy =  ((lastPool.apy.times(lastPool.apySpan))
      .plus(event.params.pool.poolSpan.times(event.params.pool.yieldPeriod)))
      .div((lastPool.apySpan).plus(event.params.pool.poolSpan));
      pool.apySpan = (lastPool.apySpan).plus(event.params.pool.poolSpan);

    }

    pool.poolId=   event.params.pool.id.toString();
  
    pool.timestamp = event.params.pool.timestamp;
    pool.totalFlow = event.params.pool.totalFlow;
    pool.totalDeposit = event.params.pool.totalDeposit;
    pool.depositIndex =  event.params.pool.depositIndex;
    pool.flowIndex =  event.params.pool.flowIndex
    pool.totalYieldStake=  event.params.pool.totalYieldStake;
    pool.totalStaked = event.params.pool.totalStaked;

    pool.totalDelegated =  event.params.pool.delegation.totalDelegated;
    pool.percentageLocked = event.params.pool.delegation.percentageLocked;
    pool.totalYieldCredit = event.params.pool.delegation.totalYieldCredit;
    pool.liquidatedIndex = event.params.pool.delegation.liquidatedIndex;
    pool.totalLiquidated = event.params.pool.delegation.totalLiquidated;

    pool.nrMembers= event.params.pool.nrMembers

    let date = (new Date(event.params.pool.timestamp.toI32() * 1000))
 
    let monthString =  ("0" + date.getUTCMonth().toString());
    let month  = monthString.substring(monthString.length -2, monthString.length);
    let year= (date.getUTCFullYear()).toString();
    let chartMonthId =  month.toString().concat(year);
    //pool.date = date;
    let chartMonth= _getChartMonth(chartMonthId, pool.timestamp, month, year);

    chartMonth.staked = pool.totalDeposit;
    chartMonth.balance = pool.totalFlow;
    

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
  

  
    function _getChartMonth( id:string, timestamp:BigInt,month:string, year:string): ChartMonth {
  
      let chartMonth = ChartMonth.load(id);
      if (chartMonth === null) {
        chartMonth = new ChartMonth(id);
        chartMonth.month = month;
        chartMonth.timestamp = timestamp;
        chartMonth.year = year;
        chartMonth.save();
      }
      return chartMonth;
    }


    
  // #endregion =========== MEMBER =================
  