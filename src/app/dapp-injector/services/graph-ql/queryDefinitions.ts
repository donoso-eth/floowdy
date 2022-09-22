export const GET_POOL = `
    {
      pools(first: 5, orderBy: id, orderDirection: desc) {
        id
        totalFlow
        totalDeposit
        timestamp
      }
    }
  `;

  export const GET_FULL_TEXT = `
  {
    creditSearch(text: "vier") {
      id
      initTimestamp
      finishPhaseTimestamp
      amount
      status
      rate
      handle
      delegatorsNr
      delegatorsRequired
      delegatorsAmount
      gelatoTaskId
      requester {
        member
      }
    }
  }
`;


export const GET_CREDITS = `
    {
      credits(first: 5,  where: {status_in:["1","2","3","4"]}, orderBy: initTimestamp, orderDirection: desc) {
        id
        initTimestamp
        finishPhaseTimestamp
        amount
        handle
        status
        rate
        delegatorsNr
        delegatorsRequired
        delegatorsAmount
        gelatoTaskId
        requester {
          member
        }
      
      }
    }
  `;

export const GET_CREDIT = `
    query($value: String!){
    credit(id:$value) {
      id
      initTimestamp
      finishPhaseTimestamp
      amount
      status
      rate
      delegatorsNr
      delegatorsRequired
      delegatorsAmount
      gelatoTaskId
      requester {
        member
      }
    
    }
  }
`;

export const GET_SUMMARY = `
    {
      totalSummaries(first: 5) {
        id
        totalIncoming
        totalBorrowed
      }
    }
  `;
export const GET_MEMBER = `
  query($address: String!){
      member(id:$address) {
    
       deposit,
       flow,
       timestamp,
       creditsRequested {
        id
        status
        finishPhaseTimestamp
        amount
        rate
        delegatorsNr
        gelatoTaskId
       }
       creditsDelegated {
          credit {
              id
              amount
              delegatorsAmount
              delegatorsNr
              delegatorsRequired
              rate
              status
              requester {
                member
              }
              finishPhaseTimestamp
              initTimestamp
          }
       }
       
      }
    }
  `;

export const GET_MEMBER_CREDITS = `
  {
    membercredits(first: 5) {
      id
      member {
        member
      }
      credit {
        id
      }πgrap
    }
  }
  `;
