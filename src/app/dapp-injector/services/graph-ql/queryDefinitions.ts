export const GET_CREDITS = `
    {
      credits(first: 5) {
        id
        amount
        rate
        delegatorsNr
        delegatorsAmount
        gelatoTaskId
        status
      }
    }
  `;

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
        gelatoTaskId
       }
       creditsDelegated {
          member {
            member 
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