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
    
  //// CONTRACT Initizlyzed
  event ContractInit(bool init);


 event MemberCreated(uint256 id, address member, uint256 timestamp);

 event MemberDeposit(uint256 id,  uint256 timestamp, uint256 deposit);


  }
