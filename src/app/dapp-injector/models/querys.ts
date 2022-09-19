export interface IMEMBER_QUERY {
  deposit: string;
  flow: string;
  creditsRequested: Array<ICREDIT_REQUESTED>
  creditsDelegated: Array<ICREDIT_DELEGATED>;
}

export interface ICREDIT_DELEGATED {
  id: string;
  amount: string;
  rate: string;
  status: string;
  denyPeriodTimestamp:string,
  delegatorsAmount:string,
  requester: { member:string}

}

export interface ICREDIT_REQUESTED  {
  denyPeriodTimestamp: string;
  amount: string;
  status: string;
  rate: string;
  delegatorsNr: string;
};