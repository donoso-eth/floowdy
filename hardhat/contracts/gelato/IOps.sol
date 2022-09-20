// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDataTypes} from "./LibDataTypes.sol";

interface IOps {

  struct Time {
        uint128 nextExec;
        uint128 interval;
    }



  function gelato() external view returns (address payable);

  /// @notice Create a timed task that executes every so often based on the inputted interval
  /// @param _startTime Timestamp when the first task should become executable. 0 for right now
  /// @param _interval After how many seconds should each task be executed
  /// @param _execAddress On which contract should Gelato execute the transactions
  /// @param _execSelector Which function Gelato should eecute on the _execAddress
  /// @param _resolverAddress On which contract should Gelato check when to execute the tx
  /// @param _resolverData Which data should be used to check on the Resolver when to execute the tx
  /// @param _feeToken Which token to use as fee payment
  /// @param _useTreasury True if Gelato should charge fees from TaskTreasury, false if not
  function createTimedTask(
    uint128 _startTime,
    uint128 _interval,
    address _execAddress,
    bytes4 _execSelector,
    address _resolverAddress,
    bytes calldata _resolverData,
    address _feeToken,
    bool _useTreasury
  ) external returns (bytes32 task);

  /// @notice Create a task that tells Gelato to monitor and execute transactions on specific contracts
  /// @dev Requires funds to be added in Task Treasury, assumes treasury sends fee to Gelato via Ops
  /// @param _execAddress On which contract should Gelato execute the transactions
  /// @param _execSelector Which function Gelato should eecute on the _execAddress
  /// @param _resolverAddress On which contract should Gelato check when to execute the tx
  /// @param _resolverData Which data should be used to check on the Resolver when to execute the tx
  function createTask(
    address _execAddress,
    bytes4 _execSelector,
    address _resolverAddress,
    bytes calldata _resolverData
  ) external returns (bytes32 task);

  /// @notice Create a task that tells Gelato to monitor and execute transactions on specific contracts
  /// @dev Requires no funds to be added in Task Treasury, assumes tasks sends fee to Gelato directly
  /// @param _execAddress On which contract should Gelato execute the transactions
  /// @param _execSelector Which function Gelato should eecute on the _execAddress
  /// @param _resolverAddress On which contract should Gelato check when to execute the tx
  /// @param _resolverData Which data should be used to check on the Resolver when to execute the tx
  /// @param _feeToken Which token to use as fee payment
  function createTaskNoPrepayment(
    address _execAddress,
    bytes4 _execSelector,
    address _resolverAddress,
    bytes calldata _resolverData,
    address _feeToken
  ) external returns (bytes32 task);

  /// @notice Cancel a task so that Gelato can no longer execute it
  /// @param _taskId The hash of the task, can be computed using getTaskId()
  function cancelTask(bytes32 _taskId) external;

  /// @notice Helper func to query fee and feeToken
  function getFeeDetails() external view returns (uint256, address);

  /// @notice Helper func to query all open tasks by a task creator
  /// @param _taskCreator Address who created the task
  function getTaskIdsByUser(address _taskCreator) external view returns (bytes32[] memory);

    /**
     * @notice Execution API called by Gelato.
     *
     * @param taskCreator The address which created the task.
     * @param execAddress Address of contract that should be called by Gelato.
     * @param execData Execution data to be called with / function selector if execution data is yet to be determined.
     * @param moduleData Conditional modules that will be used. {See LibDataTypes-ModuleData}
     * @param txFee Fee paid to Gelato for execution, deducted on the TaskTreasury or transfered to Gelato.
     * @param feeToken Token used to pay for the execution. ETH = 0xeeeeee...
     * @param useTaskTreasuryFunds If taskCreator's balance on TaskTreasury should pay for the tx.
     * @param revertOnFailure To revert or not if call to execAddress fails. (Used for off-chain simulations)
     */
   function exec(
        address taskCreator,
        address execAddress,
        bytes memory execData,
        LibDataTypes.ModuleData calldata moduleData,
        uint256 txFee,
        address feeToken,
        bool useTaskTreasuryFunds,
        bool revertOnFailure
    ) external;


   /**
     * @notice Initiates a task with conditions which Gelato will monitor and execute when conditions are met.
     *
     * @param execAddress Address of contract that should be called by Gelato.
     * @param execData Execution data to be called with / function selector if execution data is yet to be determined.
     * @param moduleData Conditional modules that will be used. {See LibDataTypes-ModuleData}
     * @param feeToken Address of token to be used as payment. Use address(0) if TaskTreasury is being used, 0xeeeeee... for ETH or native tokens.
     *
     * @return taskId Unique hash of the task created.
     */
    function createTask(
        address execAddress,
        bytes calldata execData,
        LibDataTypes.ModuleData calldata moduleData,
        address feeToken
    ) external returns (bytes32 taskId);

  function timedTask(bytes32) external view returns (Time memory) ;

}
