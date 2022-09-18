// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPool} from "../aave/IPool.sol";

/**
 * @title DataTypes
 * @author donoso_eth
 *
 * @notice A standard library of data types used throughout.
 */
library DataTypes {
  struct Floowdy_Init {
    ISuperfluid host;
    ISuperToken superToken;
    IERC20 token;
    IPool pool;
    IERC20 aToken;
    address ops;
    address epnsComm;
    address epnsChannel;
  }

  struct Member {
    uint256 id;
    address member;
    int96 flow;
    bytes32 flowGelatoId;
    uint256 flowDuration;
    uint256 deposit;
    uint256 timestamp;
    uint256 initTimestamp;
    uint256 yieldAccrued;
    uint256 amountLocked;
  }

  struct Pool {
    uint256 id;
    uint256 timestamp;
    int96 totalFlow;
    uint256 totalDeposit;
    uint256 totalDepositFlow;
    uint256 totalYield;
    uint256 depositIndex;
    uint256 flowIndex;
    uint256 totalDelegated;
    uint256 totalMembers;
  }


  enum CreditStatus {
    NONE,
    PENDING,
    APPROVED,
    REJECTED
  }

  struct Credit {
    uint256 id;
    address requester;
    uint256 initTimestamp;
    uint256 denyPeriodTimestamp;
    CreditStatus status;
    uint256 amount;
    uint256 rate;
    uint256 delegatorsNr;
    address[] delegators;
    uint256 delegatorsAmount;
    bytes32 gelatoTaskId;
  }
}
