// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;



/**
 * @title IPUSHCommInterface 
 * @author EPNS
 * @notice Defines the basic interface for an Aave Pool.
 **/
interface  IPUSHCommInterface {

    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;

}