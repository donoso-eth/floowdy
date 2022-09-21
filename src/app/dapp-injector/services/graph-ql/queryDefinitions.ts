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



export const GET_CREDITS = `
    {
      credits(first: 5) {
        id
        initTimestamp
        finishPhaseTimestamp
        amount
        status
        rate
        delegatorsNr
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