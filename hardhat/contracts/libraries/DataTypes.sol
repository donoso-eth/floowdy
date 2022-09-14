// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;


import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

/**
 * @title DataTypes
 * @author donoso_eth
 *
 * @notice A standard library of data types used throughout.
 */
library DataTypes {


  struct Member {
    uint256 id;
    address member;
    int96 flow;
    bytes32 flowGelatoId;
    uint256 flowduration;
    uint256 deposit;
    uint256 timestamp;
    uint256 yieldAccrued;
  }


  struct Pool {
    uint256 id;
    uint256 timestamp;
    uint256 totalFlow;
    uint256 totalDeposit;
    uint256 totalYield;
    uint256 depositIndex;
    uint256 flowIndex;
    uint256 totalDelegated;
  }


  struct Credit {
    uint256 id;
    address requester;
    uint256 initTimestamp;
    uint256 denyPeriodFinishh;
    bool accepted;
    uint256 amount;
    uint256 rate;
  }

}
