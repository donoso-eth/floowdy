// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPool} from "../aave/IPool.sol";
import {IAToken} from "../aave/IAToken.sol";

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
        address stableDebtToken;
        address debtToken;
        IAToken aToken;
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
        uint256 amountLoss;
        uint256 currentYield;
        uint256 memberSpan;
    }

    struct POOL_DELEGATION {
        uint256 totalDelegated;
        uint256 percentageLocked;
        uint256 totalYieldCredit;
        uint256 liquidatedIndex;
        uint256 totalLiquidated;
    }

    struct Pool {
        uint256 id;
        uint256 timestamp;
        int96 totalFlow;
        uint256 totalDeposit;
        uint256 totalDepositFlow;
        uint256 depositIndex;
        uint256 flowIndex;
        uint256 totalYieldStake;
        uint256 totalStaked;
        POOL_DELEGATION delegation;
        uint256 nrMembers;
        uint256 yieldPeriod;
        uint256 poolSpan;

    }

    enum CreditStatus {
        NONE,
        PHASE1,
        PHASE2,
        PHASE3,
        PHASE4,
        APPROVED,
        REJECTED,
        CANCELLED,
        REPAYED,
        LIQUIDATED
    }

    struct CreditRepaymentOptions {
        uint256 nrInstallments;
        uint256 interval;
        uint256 installment;
        uint256 installmentPrincipal;
        uint256 installmentRateAave;
        uint256 installmentRatePool;
        uint256 amount;
        uint256 rateAave;
        uint256 ratePool;
        uint256 totalYield;
        uint256 currentInstallment;
        bytes32 GelatoRepaymentTaskId;
    }

    struct CreditDelegatorsOptions {
        uint256 delegatorsNr;
        uint256 delegatorsRequired;
        address[] delegators; 
        uint256 delegatorsAmount;
        uint256 delegatorsGlobalFee;
    }

    struct Credit {
        uint256 id;
        address requester;
        uint256 initTimestamp;
        uint256 finishPhaseTimestamp;
        CreditStatus status;
        bytes32 gelatoTaskId;
        CreditDelegatorsOptions delegatorsOptions;
        CreditRepaymentOptions repaymentOptions;
    }

    struct CreditRequestOptions {
        uint256 amount;
        uint256 rateAave;
        uint256 ratePool;
        uint256 interval;
        uint256 nrInstallments;
        string handle;
        string  bio;
    }
}
