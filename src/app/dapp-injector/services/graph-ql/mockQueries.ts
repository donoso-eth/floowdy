import { IMEMBER_QUERY } from '../../models';

export const mockMember1 = {
  __typename: 'Member',
  deposit: '250000000000000000000000',
  flow: '0',
  timestamp: '2026757668',
  amountLocked: '0',
  amountLoss: '0',
  creditsRequested: [
    {
      __typename: 'Credit',
      id: '1',
      status: '5',
      finishPhaseTimestamp: '2031996290',
      amount: '1000095888',
      rateAave: '3',
      ratePool: '4',
      delegatorsNr: '1',
      gelatoTaskId: '',
    },
  ],
  creditsDelegated: [],
};
