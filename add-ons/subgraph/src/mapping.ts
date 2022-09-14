import { MemberCreated, MemberDeposit} from '../generated/Floowdy/Floowdy'
import {Member  } from '../generated/schema';


export function handleMemberCreated(event:MemberCreated ):void {
    let id = event.params.id.toString();
    let member = getMember(id)
    member.member = event.params.member.toHexString();
    member.timestamp = event.params.timestamp;
    member.save();
}



export function handleMemberDeposit(event:MemberDeposit ):void {
    let id = event.params.id.toString();
    let member = getMember(id)
    member.deposit = event.params.deposit;
    member.timestamp = event.params.timestamp;

}


function getMember(memberId: string): Member {
    let member = Member.load(memberId);
    if (member === null) {
      member = new Member(memberId);
      member.save();
    }
    return member;
  }