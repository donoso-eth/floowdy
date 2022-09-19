export interface IMEMBER_QUERY {
  deposit: number;
  flow: number;
  creditsRequested: Array<ICREDIT_REQUESTED>
  creditsDelegated: Array<ICREDIT_DELEGATED>;
}

export interface ICREDIT_DELEGATED {
  id: string;
  amount: string;
  rate: string;
  status: string;
  denyPeriodTimestamp:number,
  delegatorsAmount:number,
  initTimestamp: number,
  requester: { member:string}

}

export interface ICREDIT_REQUESTED  {
  denyPeriodTimestamp: number;
  initTimestamp: number,
  amount: number;
  status: string;
  rate: number;
  delegatorsNr: number;
};