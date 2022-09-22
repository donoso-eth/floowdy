// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {DataTypes} from "./DataTypes.sol";

/**
 * @title Events
 * @author donoso_eth
 *
 * @notice A standard library of events used throughout.
 */
library Events {
    event MemberDeposit(DataTypes.Member member);

    event MemberStream(DataTypes.Member member);

    event MemberDelegateCredit(
        uint256 creditId,
        address member,
        uint256 amountLocked
    );


    event CreditRequested(DataTypes.Credit credit, string lensHandle);

    event CreditApproved(DataTypes.Credit credit);

    event CreditRejected(DataTypes.Credit credit);

    event CreditCancelled(DataTypes.Credit credit);

    event CreditCheckIn(uint256 creditId, address delegator);

    event CreditCheckOut(uint256 creditId, address delegator);

    event PoolUpdated(DataTypes.Pool pool);
}
