# Floowdy

This project is developed in the frame of the Eth Online 2022.

Floowdy helps web3 on the one hand being more robust and secure fostering the more utilisation of stable coins with help of Superfluid and aave staking, as well as using the collateral available in aave to foster credit delegation to pool members.


Webb app deployed under [https://floowdy.web.app](https://floowdy.web.app)

## Pool
The pool accepts deposits or streams of Superfluid Supertoken and will after a threshold is met, recursively downgrade the  supertokens to erc-20 tokens and supply to the aave protocol.

The process is as follows:
- User deposit or stream supertokens (We have created a supertoken for the usdc aave)
- A gelato task watches the pool and when achieves a certain threshold (5 ethers formthe demo) will :
    1) Downgrade the supertokens---> to underlying erc20
    2) supply() to aave the underlying tokens

Every time a pool interaction happens the pool will maintain the indexes for allocation of the yield to the users. In every pool interaction the pool call atoken(asset).balanceOf(poll address) to gather the yield won so far.


## Credit Delegation
Floowdy will use the collateral to delegate to other pool members. 
Every member can request a credit, the amount of the credit has two constraints, the available ave borrow-base and the member available balance n the pool.
In order to request a credit, the member is required to have a lens profile, so the pool members can have some insights into his reputation.

The Credit approval process has three phases.

  Phase 1) 1 pool member checks in the full risk (50 of credit) we move to Phase4 waiting for approval, if not a member we move to Phase 1
  Phase 2) 10 pool members check in for 1/10 of the risk we move to Phase4 waiting for approval, if not credit will be rejected
  Phase 3) (not implemented)
  Phase 4) The credit requester exeutes the credit --->
          - The pool approves credit delegation to member
          - the member borrows interacting directly from aave pool

The approval process is managed by the gelato network. After credit request, a gelato task will move from one phase to the other after a certain interval


## Credit Repayment

As the credits traded between the members mimics IRL conditions, floowdy integrates a repayment strategy in installments. The credit will be repayed automatically in n-installments defined by request.
The repayment will be automated by Gelato, after the predined interval (one month/one day) ert Gelato will trigger:
  - Transfer borrowed tokens from cedit-requester to the pool
  - aave.repay() to the pool
The repayment task will executed with a try catch call ensuring that, if the repayment reverts, the credit will automatically be liquidated



## How is made

Floowdy has been developed using Angular and the library angular-web3 (still in development)
It uses PrimeNg as scss/component framework

There is a main contract  Floowdy.sol in solidity

We integrate a superfluid super app base for managing the streams and receiving the callbacks required to update the pool as well as we implement the tokens received(ERC777)  interface for reacting after a .send(tokens) 
We also implement gelato for stopping the streams programmatically when the user wants to stream only a certain amount/time.

We use aave to stake and earn yield distributed among the members, we also use aave to delegate pool collateral credit power to members.

We query Lens Protocol to have insights of the pool participants.

We use the graph for storing our data and querying with appollo client in front end


## Detail description of techmology/protocols used

### SuperFluid


### Aave


### The Graph
For this project we hace developpen a new subgraph 
It uses 5 entities:
        - Member
        - Pool
        - Credit
        - MemberCredit
        - Installment
Between the entities we have 1-1, 1 to many, and many to many relationshipps
and compute 11 events for maintaining the state up to date.
For local devellopment wwe have used docker for creating a local node.
We query the data with apollo client and uses waatchquery/uery depending of the use case

