export const GET_DEMANDS = `
    {
      loanDemands(first: 5, where: {status:"0"}, orderBy: id, orderDirection: asc) {
        id
        loanAmount
        fee
        superToken
        collateralShare
        duration
        loanTaker
        status
   
      }
    }
  `;



export const GET_CREDITS = `
    {
      credits(first: 5) {
        id
        initTimestamp
        denyPeriodTimestamp
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
        denyPeriodTimestamp
        amount
        rate
        delegatorsNr
        gelatoTaskId
       }
       creditsDelegated {
          credit {
              id
              amount
              rate
              status
              requester {
                member
              }
              denyPeriodTimestamp
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