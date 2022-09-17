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
    


 event MemberAction(DataTypes.Member);

 event CreditAction(DataTypes.Credit);

 event PoolUpdated(uint256 id);

  }
