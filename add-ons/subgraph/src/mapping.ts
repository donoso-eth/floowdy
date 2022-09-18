import {  CreditApproved, CreditCheckIn, CreditCheckOut, CreditRejected, CreditRequested, MemberDeposit, MemberStream} from '../generated/Floowdy/Floowdy'
import {Credit, Member, MemberCredit  } from '../generated/schema';
import { store } from '@graphprotocol/graph-ts'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
// #region =========== MEMBER =================

export function handleMemberDeposit(event:MemberDeposit ):void {
  _updateMember(event)
}

export function handleMemberStream(event:MemberDeposit ):void {
  _updateMember(event)
}


function _updateMember(event: MemberDeposit):void {
  let id = event.params.param0.id.toString();
  let member = _getMember(id, event.params.param0.member)
  member.deposit = event.params.param0.deposit;
  member.timestamp = event.params.param0.timestamp;
  member.flow = event.params.param0.flow;
  member.flowGelatoId =  event.params.param0.flowGelatoId.toHexString();
  member.flowDuration =  event.params.param0.flowDuration;
  member.initTimestamp =  event.params.param0.initTimestamp;
  member.yieldAccrued =  event.params.param0.yieldAccrued;
  member.amountLocked = event.params.param0.amountLocked;
  member.save()
}


function _getMember(memberId: string, memberAddress:string): Member {
    let member = Member.load(memberId);
    if (member === null) {
      member = new Member(memberId);
      member.member = memberAddress;
      member.save();
    }
    return member;
  }

  
// #endregion =========== MEMBER =================

// #region =========== CREDIT =================

export function handleCreditRequested(event:CreditRequested):void {
  _updateCredit(event)
}

export function handleCreditCheckIn(event:CreditCheckIn):void {
  let id = event.params.creditId.toString().concat(event.params.delegator.toHexString())
  let delegatorsEntry =  new MemberCredit(id);
  delegatorsEntry.save()

  let credit = _getCredit(event.params.creditId.toString());
  credit.delegatorsNr = credit.delegatorsNr.plus(BigInt.fromI32(1));
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
  let id = event.params.param0.id.toString();
  let credit = _getCredit(id);
  // for (let i = 0; i < credit.delegators.length; ++i) {
  //    let delegatorId:string =  credit.delegators[i];
  //    let delegator:Member = _getMember(delegatorId);
  //    delegator.amountLocked = delegator.amountLocked.plus(credit.delegatorsAmount); 
  //    delegator.save()
  // }
  credit.status = BigInt.fromI32(event.params.param0.status);
  credit.save()
}

export function handleCreditRejected(event:CreditRejected):void {
  let id = event.params.credit.toString()
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
function _getCredit(creditId:string): Credit {
  let credit = Credit.load(creditId);
  if (credit == null) {
    credit = new Credit(creditId);
  }
  return credit
}

function _updateCredit(event: CreditRequested):Credit {
  let id = event.params.param0.id.toString();
  let eventObject = event.params.param0;
  let credit = _getCredit(id);
  credit.requester = eventObject.requester.toHexString();
  credit.initTimestamp = eventObject.initTimestamp;
  credit.denyPeriodTimestamp = eventObject.denyPeriodTimestamp;
  credit.status = BigInt.fromI32(eventObject.status);
  credit.rate = eventObject.rate;
  credit.delegatorsNr = eventObject.delegatorsNr;
  credit.delegatorsAmount = eventObject.delegatorsAmount;

  return credit
}



// #endregion =========== CREDIT =================