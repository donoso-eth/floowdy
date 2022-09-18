export interface IMEMBER_QUERY {
  deposit: number;
  flow: number;
  creditsRequested: {
    denyPeriodTimestamp: number;
    amount: number;
    rate: number;
    delegatorsNr: number;
  };
  creditsDelegated: Array<ICREDIT_DELEGATED>;
}

export interface ICREDIT_DELEGATED {
  id: string;
  amount: string;
  rate: string;
  status: string;
  denyPeriodTimestamp:number,
  initTimestamp: number,
  requester: { member:string}

}
