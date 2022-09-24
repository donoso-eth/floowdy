
    export const GET_AAVE_DATA = `
    {
    reserves(first: 1, where: {underlyingAsset:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}) {
      name
      underlyingAsset
      
      liquidityRate 
      stableBorrowRate
      variableBorrowRate
      
      totalATokenSupply
      totalCurrentVariableDebt
    }
  }
  `