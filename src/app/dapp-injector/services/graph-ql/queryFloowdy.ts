export const GET_CHARTS = `
    {
      chartMonths(first: 5, orderBy: id, orderDirection: desc) {
        id
     month
     year
      }
    }
  `;

export const GET_POOL = `
    {
      pools(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        totalFlow
        totalDeposit
        nrMembers
        timestamp
        totalStaked
        totalYieldStake
        totalYieldCredit
        totalDelegated
        apy
        apySpan
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
      credits(first: 5, where: {status_in:["1","2","3","4","5","8","9"]}, orderBy: initTimestamp, orderDirection: desc) {
        id
        initTimestamp
        finishPhaseTimestamp
        amount
        status
        handle
        rateAave
        ratePool
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
      rateAave
      ratePool
      delegatorsNr
      delegatorsRequired
      delegatorsAmount
      delegators {
        member {
          member
        }
      }
      interval
      installment
      currentInstallment
      installments (orderBy: nr, orderDirection: desc) {
          nr
          timestamp
      }
      nrInstallments
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
    
       deposit
       flow
       timestamp
       amountLocked
       amountLoss
       
       creditsRequested {
        id
        status
        finishPhaseTimestamp
        delegatorsAmount
        amount
        rateAave
        ratePool
        delegatorsNr
        gelatoTaskId
        requester {
          member
        }
       }
       creditsDelegated {
          credit {
              id
              amount
              delegatorsAmount
              delegatorsNr
              delegatorsRequired
              rateAave
              ratePool
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
