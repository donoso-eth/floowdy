// #region =========== CREDIT =================

import { store } from "@graphprotocol/graph-ts";
import { CreditRequested, CreditCheckIn, CreditCheckOut, CreditApproved, CreditRejected, CreditChangePhase, CreditInstallment, CreditLiquidated } from "../generated/Floowdy/Floowdy";
import { MemberCredit, Credit, Installment } from "../generated/schema";
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';


export function handleCreditRequested(event:CreditRequested):void {
    _updateCredit(event)
  }
  
  export function handleCreditCheckIn(event:CreditCheckIn):void {
    let id = event.params.creditId.toString().concat(event.params.delegator.toHexString())
    let delegatorsEntry =  new MemberCredit(id);
    delegatorsEntry.member = event.params.delegator.toHexString();
    delegatorsEntry.credit = event.params.creditId.toString(); 
    delegatorsEntry.save()
  
    let credit = _getCredit(event.params.creditId.toString());
    credit.delegatorsNr = credit.delegatorsNr.plus(BigInt.fromI32(1));
    credit.save()
   
  }
           
  export function handleCreditChangePhase(event:CreditChangePhase):void {
    let id = event.params.credit.id.toString();
    let credit = _getCredit(id);
    credit.status = BigInt.fromI32(event.params.credit.status);
    credit.finishPhaseTimestamp = event.params.credit.finishPhaseTimestamp;
    credit.save()
   
  }

  
  export function handleCreditCheckOut(event:CreditCheckOut):void {
    let id = event.params.creditId.toString().concat(event.params.delegator.toHexString())
    let credit = _getCredit(event.params.creditId.toString());
    credit.delegatorsNr = credit.delegatorsNr.minus(BigInt.fromI32(1));
    credit.save()
    store.remove('MemberCredit', id)
  }
  
  export function handleCreditApproved(event:CreditApproved):void {
    let id = event.params.credit.id.toString();
    let credit = _getCredit(id);
    credit.status = BigInt.fromI32(event.params.credit.status);
    
    credit.save()
  }
  
  export function handleCreditRejected(event:CreditRejected):void {
    let id = event.params.credit.id.toString()
    let credit = _getCredit(id);
    // for (let i = 0; i < credit.delegators.length; ++i) {
    //    let delegatorId:string =  credit.delegators[i];
    //    let delegator:Member = _getMember(delegatorId);
    //    delegator.amountLocked = delegator.amountLocked.plus(credit.delegatorsAmount); 
    //    delegator.save()
    //    store.remove('MemberCredit', id)
    // }
    credit.status = BigInt.fromI32(event.params.credit.status);
    credit.save()
  }

 export function handleCreditInstallment(event:CreditInstallment):void {
  let id = event.params.creditId.toString();
  let credit = _getCredit(id);
  credit.currentInstallment = credit.currentInstallment.plus(BigInt.fromI32(1));
  let installmentId = event.params.creditId.toString().concat(credit.requester).concat(credit.currentInstallment.toString())

  let installment = Installment.load(installmentId);
    if (installment == null) {
      installment = new Installment(installmentId);
      installment.timestamp = event.block.timestamp;
      installment.nr = credit.currentInstallment;
      installment.credit = id;
      installment.save()
    }
    credit.save()

  }

  export function handleCreditLiquidated(event:CreditLiquidated):void {
    let id = event.params.creditId.toString();
    let credit = _getCredit(id);
    credit.status = BigInt.fromI32(9);
    let alreadypayed = credit.currentInstallment.times(credit.installment);
    let loss = credit.amount.minus(alreadypayed);

    credit.save()
    

  }

 


  function _getCredit(creditId:string): Credit {
    let credit = Credit.load(creditId);
    if (credit == null) {
      credit = new Credit(creditId);
    }
    return credit
  }
  
  function _updateCredit(event: CreditRequested):Credit {
    let id = event.params.credit.id.toString();
    let eventObject = event.params.credit;
    let credit = _getCredit(id);
    credit.requester = eventObject.requester.toHexString();
    credit.initTimestamp = eventObject.initTimestamp;
    credit.finishPhaseTimestamp = eventObject.finishPhaseTimestamp;
    credit.status = BigInt.fromI32(eventObject.status);
    // credit.handle = event.params.lensHandle;
    credit.nrInstallments = eventObject.repaymentOptions.nrInstallments;
    credit.interval = eventObject.repaymentOptions.interval;
    credit.amount = eventObject.repaymentOptions.amount;
    credit.rate = eventObject.repaymentOptions.rate;
    credit.totalYield = eventObject.repaymentOptions.totalYield;
    credit.currentInstallment = eventObject.repaymentOptions.currentInstallment;
    credit.installment = eventObject.repaymentOptions.installment;
   

    credit.delegatorsNr = eventObject.delegatorsOptions.delegatorsNr;
    credit.delegatorsRequired = eventObject.delegatorsOptions.delegatorsRequired;
    credit.delegatorsAmount = eventObject.delegatorsOptions.delegatorsAmount;
    credit.delegatorsGlobalFee = eventObject.delegatorsOptions.delegatorsGlobalFee;
    credit.save()
    return credit
  }
  
  
  
  // #endregion =========== CREDIT =================