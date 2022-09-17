# Floowdy

This project is developed in the frame of the Eth Online 2022.

Floowdy aims to help web3 being more robust and secure.

Webb app deployed under [https://floowdy.web.app](https://floowdy.web.app)

## Pool

The pool consists of two subpools (deposit and streams) accept deposits or streams of Superfluid Supertoken and will after a threshold is met recursively unwrap the tokens and supply to the aave protocol.
The yield generated will split among the subpools. At every moment the members can push the tokens from subpool stream ---> subpool deposit.


## Credit Delegation

Floowdy will use the collatarel to delegate to other pool members. 
Every member can request to have a credit delegated for double the balance.


