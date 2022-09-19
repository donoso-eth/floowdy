import { IMEMBER_QUERY } from "../../models";

export const mockMember1 = {
  deposit: '540000',
  flow: '0',
  creditsRequested: [
    {
      __typename: 'Credit',
      id: '1',
      denyPeriodTimestamp: '1663410064',
      amount: '10000',
      rate: '3',
      delegatorsNr: '5',
      gelatoTaskId: '',
      status: '2',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      
    },
    {
      __typename: 'Credit',
      id: '2',
      status: '3',
      denyPeriodTimestamp: '1663410132',
      amount: '10000',
      rate: '3',
      delegatorsNr: '4',
      gelatoTaskId: '',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
    },
    {
      __typename: 'Credit',
      id: '3',
      status: '1',
      denyPeriodTimestamp: '1663410178',
      amount: '10000',
      rate: '3',
      delegatorsNr: '4',
      gelatoTaskId: '',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
    },
  ],
  creditsDelegated: [],
};

export const mockMember2 = {
  deposit: '280000',
  flow: '0',
  creditsRequested: [],
  creditsDelegated: [
    {
      __typename: 'Credit',
      id: '1',
      amount: '10000',
      rate: '3',
      status: '2',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      denyPeriodTimestamp: '1663410064',
      initTimestamp: '1663409464',
      delegatorsAmount:'3000'
    },
    {
      __typename: 'Credit',
      id: '2',
      amount: '10000',
      rate: '3',
      status: '3',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      denyPeriodTimestamp: '1663410132',
      initTimestamp: '1663409532',
      delegatorsAmount:'7000'
    },
    {
      __typename: 'Credit',
      id: '3',
      amount: '10000',
      rate: '3',
      status: '1',
      requester: {
        __typename: 'Member',
        member: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      denyPeriodTimestamp: '1663410178',
      initTimestamp: '1663409578',
      delegatorsAmount:'9000'
    },
  ],
};
