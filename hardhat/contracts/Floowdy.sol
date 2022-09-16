//SPDX-License-Identifier: Unlicense
pragma solidity >=0.4.22 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IPoolAddressesProvider} from "./aave/IPoolAddressesProvider.sol";
import {IPool} from "./aave/IPool.sol";

import {ISuperfluid, ISuperAgreement, ISuperToken, ISuperApp, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import {OpsReady} from "./gelato/OpsReady.sol";
import {IOps} from "./gelato/IOps.sol";

import { IPUSHCommInterface} from "./epns/IPUSHCommInterface.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {Events} from "./libraries/Events.sol";

contract Floowdy is SuperAppBase, IERC777Recipient {
    using SafeMath for uint256;

    uint256 MAX_INT;

    ISuperfluid public host; // host
    IConstantFlowAgreementV1 public cfa; // the stored constant flow agreement class address
    ISuperToken superToken;

    IERC20 token;
    IERC20 aToken;

    IPool pool;

    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData internal _cfaLib;

    mapping(address => DataTypes.Member) public members;
    mapping(uint256 => address) public memberAdressById;

    uint256 totalMembers;
    mapping(uint256 => DataTypes.Pool) public poolByTimestamp;
    uint256 public poolId;
    uint256 public poolTimestamp;

    address public ops;
    address payable public gelato;
    address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    address epnsComm;
    address epnsChannel;

    constructor( DataTypes.Floowdy_Init memory floowdy_init) {
        require(address(floowdy_init.host) != address(0), "host is zero address");
        require(
            address(floowdy_init.superToken) != address(0),
            "acceptedToken is zero address"
        );
        host = floowdy_init.host;
        superToken = floowdy_init.superToken;
        token = floowdy_init.token;
        pool = floowdy_init.pool;
        aToken = floowdy_init.aToken;
        epnsComm = floowdy_init.epnsComm;
        epnsChannel = floowdy_init.epnsChannel;

        cfa = IConstantFlowAgreementV1(
            address(
                host.getAgreementClass(
                    keccak256(
                        "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                    )
                )
            )
        );
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        host.registerApp(configWord);

        MAX_INT = 2**256 - 1;
        token.approve(address(pool), MAX_INT);

        //// tokens receie implementation
        ops = floowdy_init.ops;
        gelato = IOps(ops).gelato();

        //// tokens receie implementation
        IERC1820Registry _erc1820 = IERC1820Registry(
            0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24
        );
        bytes32 TOKENS_RECIPIENT_INTERFACE_HASH = keccak256(
            "ERC777TokensRecipient"
        );

        _erc1820.setInterfaceImplementer(
            address(this),
            TOKENS_RECIPIENT_INTERFACE_HASH,
            address(this)
        );
    }

    /**
     * @notice ERC277 call back allowing deposit tokens via .send()
     * @param from Member (user sending tokens / depositing)
     * @param amount amount received
     */
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {
        require(msg.sender == address(superToken), "INVALID_TOKEN");
        require(amount > 0, "AMOUNT_TO_BE_POSITIVE");

        console.log("tokens_reveived");

        console.log(amount);
        _deposit(from, amount);
    }

    // ============= ============= Members ============= ============= //
    // #region Members

    function _deposit(address _member, uint256 amount) internal {
        _poolRebalance();

        _memberUpdate(_member);

        // poolByTimestamp[block.timestamp].totalShares = poolByTimestamp[block.timestamp].totalShares + inDeposit - outDeposit;
        poolByTimestamp[block.timestamp].totalDeposit =
            poolByTimestamp[block.timestamp].totalDeposit -
            amount;

        DataTypes.Member storage member = _getMember(_member);

        member.deposit += amount;

        if (member.flow > 0) {
            member.deposit +=
                uint96(member.flow) *
                (block.timestamp - member.timestamp);
        }

        member.timestamp = block.timestamp;
        emit Events.MemberAction(member);
    }

    // #endregion

    // #region  ============= =============  Internal Member Functions ============= ============= //

    function _getMember(address _member)
        internal
        returns (DataTypes.Member storage)
    {
        DataTypes.Member storage member = members[_member];

        if (member.id == 0) {
            totalMembers++;
            member.member = _member;
            member.initTimestamp = block.timestamp;
            member.id = totalMembers;
            memberAdressById[member.id] = _member;
        }

        return member;
    }

    /**
     * @notice Calculate the total balance of a user/member
     * @dev it calculate the yield earned and add the total deposit (send+stream)
     * @return realtimeBalance the realtime balance multiplied by precission (10**6)
     */
    function _getMemberBalance(address _member)
        internal view
        returns (uint256 realtimeBalance)
    {
        DataTypes.Member storage member = members[_member];

        uint256 yieldMember = totalYieldEarnedMember(_member);

        if (member.flow > 0) {
            realtimeBalance =
                yieldMember +
                (member.deposit) +
                uint96(member.flow) *
                (block.timestamp - member.timestamp);
        }
    }

    function _memberUpdate(address _member) internal {
        DataTypes.Member storage member = members[_member];

        if (member.timestamp < block.timestamp) {
            uint256 memberBalance = _getMemberBalance(_member);
            // uint256 memberShares = balanceOf(_member);

            // member.shares = memberShares;

            int256 memberDepositUpdate = int256(memberBalance) -
                int256(member.deposit);

            uint256 yieldMember = totalYieldEarnedMember(_member);

            if (member.flow > 0) {
                poolByTimestamp[block.timestamp].totalDepositFlow =
                    poolByTimestamp[block.timestamp].totalDepositFlow -
                    uint96(member.flow) *
                    (block.timestamp - member.timestamp);
                poolByTimestamp[block.timestamp].totalDeposit =
                    poolByTimestamp[block.timestamp].totalDeposit +
                    uint256(memberDepositUpdate);
            }
            member.deposit = memberBalance;
            member.timestamp = block.timestamp;
        }
    }

 
    function _updateFlow(address _member, int96 _inFlow, bytes32 _taskId, uint256 _duration) internal {
        DataTypes.Member storage member = members[_member];
        require(_inFlow >= 0, "ONLY_STREAM_IN_POSITIONS");

        _memberUpdate(_member);

        if (member.flowGelatoId != bytes32(0)) {
          cancelTask(member.flowGelatoId);
        }
        member.flowGelatoId = _taskId;
        member.flowDuration = _duration;


        poolByTimestamp[block.timestamp].totalFlow =
            poolByTimestamp[block.timestamp].totalFlow -
            member.flow +
            _inFlow;

        member.flow = _inFlow;

        console.log("updateMemberFlow");
    }

    function _calculateYieldMember(address _member)
        internal
        view
        returns (uint256 yieldMember)
    {
        DataTypes.Member storage member = members[_member];

        uint256 lastTimestamp = member.timestamp;

        ///// Yield from deposit

        uint256 yieldFromDeposit = (member.deposit *
            (poolByTimestamp[poolTimestamp].depositIndex -
                poolByTimestamp[lastTimestamp].depositIndex));

        yieldMember = yieldFromDeposit;
        if (member.flow > 0) {
            ///// Yield from flow
            uint256 yieldFromFlow = uint96(member.flow) *
                (poolByTimestamp[poolTimestamp].flowIndex -
                    poolByTimestamp[lastTimestamp].flowIndex);

            yieldMember = yieldMember + yieldFromFlow;
        }
    }

    function totalYieldEarnedMember(address _member)
        public
        view
        returns (uint256 yieldMember)
    {
        uint256 yieldEarned = _calculateYieldMember(_member);

        (uint256 yieldDepositNew, uint256 yieldFlowNew) = _calculateIndexes();

        DataTypes.Member storage member = members[_member];

        uint256 yieldDeposit = yieldDepositNew * member.deposit;
        uint256 yieldInFlow = uint96(member.flow) * yieldFlowNew;

        yieldMember = yieldEarned + yieldDeposit + yieldInFlow;
    }

    // #endregion

    // ============= ============= Pool ============= ============= //
    // #region Pool

    function _calculateYield() public {}

    function _poolRebalance() public {
        poolId++;

        DataTypes.Pool memory currentPool = DataTypes.Pool(
            0,
            block.timestamp,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );

        DataTypes.Pool memory lastPool = poolByTimestamp[poolTimestamp];

        uint256 poolSpan = currentPool.timestamp - lastPool.timestamp;

        currentPool.totalDepositFlow =
            uint96(lastPool.totalFlow) *
            poolSpan +
            lastPool.totalDepositFlow;

        currentPool.totalFlow = lastPool.totalFlow;
        (currentPool.depositIndex, currentPool.flowIndex) = _calculateIndexes();

        currentPool.depositIndex =
            currentPool.depositIndex +
            lastPool.depositIndex;
        currentPool.flowIndex = currentPool.flowIndex + lastPool.flowIndex;

        currentPool.totalFlow = lastPool.totalFlow;

        currentPool.timestamp = block.timestamp;

        poolByTimestamp[block.timestamp] = currentPool;

        poolTimestamp = block.timestamp;

        // poolTimestampById[PoolId.current()] = block.timestamp;

        console.log("pool_update");
    }

    function _calculateIndexes()
        internal
        view
        returns (uint256 depositIndex, uint256 depositFlow)
    {
        DataTypes.Pool storage lastPool = poolByTimestamp[poolTimestamp];

        uint256 poolSpan = block.timestamp - lastPool.timestamp;

        uint256 averageFlowDeposit = (
            (uint96(lastPool.totalFlow) + lastPool.totalDepositFlow * poolSpan)
        ).div(2);

        uint256 totalDepositToYield = averageFlowDeposit +
            lastPool.totalDeposit;

        uint256 yieldPool = _calculatePoolYield();

        if (totalDepositToYield == 0 || yieldPool == 0) {
            depositIndex = 0;
            depositFlow = 0;
        } else {
            if (lastPool.totalDeposit != 0) {
                depositIndex = (
                    (lastPool.totalDeposit * yieldPool).div(
                        (lastPool.totalDeposit) * totalDepositToYield
                    )
                );
            }
            if (lastPool.totalFlow != 0) {
                depositFlow = (
                    (averageFlowDeposit * yieldPool).div(
                        uint96(lastPool.totalFlow) * totalDepositToYield
                    )
                );
            }
        }
    }

    function _calculatePoolYield() internal view returns (uint256 yield) {
        uint256 randomYield = 1000 + (block.timestamp % 1000);

        yield = (block.timestamp - poolTimestamp) * randomYield;
    }

    // #endregion Pool

    // ============= ============= Aave ============= ============= //
    function aaveSupply() public {
        uint256 poolSuperTokenBalance = (superToken.balanceOf(address(this)))
            .div(10**12);

        superToken.downgrade(poolSuperTokenBalance);

        uint256 poolTokenBalance = token.balanceOf(address(this));

        if (poolTokenBalance > 10000000000000) {
            poolTokenBalance = 10000000000000;
        }

        pool.supply(address(token), poolTokenBalance, address(this), 0);
    }

    // #endregion Aave

    // ============= ============= Super App Calbacks ============= ============= //
    // #region Super App Calbacks
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;

        (address sender, address receiver) = abi.decode(
            _agreementData,
            (address, address)
        );

        (, int96 inFlowRate, , ) = cfa.getFlow(
            superToken,
            sender,
            address(this)
        );
        ISuperfluid.Context memory decodedContext = host.decodeCtx(_ctx);

        uint256 duration = 0;
        bytes32 taskId = bytes32(0);
        if (decodedContext.userData.length > 0) {
          duration = parseLoanData(host.decodeCtx(_ctx).userData);
          taskId = createStopStreamTask(sender, duration);
        }
        _updateFlow(sender, inFlowRate, taskId, duration);
        return newCtx;
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;

        (address sender, address receiver) = abi.decode(
            _agreementData,
            (address, address)
        );

        (, int96 inFlowRate, , ) = cfa.getFlow(
            superToken,
            sender,
            address(this)
        );
        ISuperfluid.Context memory decodedContext = host.decodeCtx(_ctx);
    
        uint256 duration = 0;
        bytes32 taskId = bytes32(0);
        if (decodedContext.userData.length > 0) {
          duration = parseLoanData(host.decodeCtx(_ctx).userData);
          taskId = createStopStreamTask(sender, duration);
        }
        _updateFlow(sender, inFlowRate, taskId, duration);

        return newCtx;
    }

    function afterAgreementTerminated(
        ISuperToken, /*superToken*/
        address, /*agreementClass*/
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata, /*cbdata*/
        bytes calldata _ctx
    ) external virtual override returns (bytes memory newCtx) {
        (address sender, address receiver) = abi.decode(
            _agreementData,
            (address, address)
        );
        newCtx = _ctx;
        _updateFlow(sender, 0,0,0);
        return newCtx;
    }

    function parseLoanData(bytes memory data)
        public
        pure
        returns (uint256 duration)
    {
        duration = abi.decode(data, (uint256));
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return
            ISuperAgreement(agreementClass).agreementType() ==
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            );
    }

    function _isSameToken(ISuperToken _superToken) private view returns (bool) {
        return address(_superToken) == address(superToken);
    }

    modifier onlyHost() {
        require(
            msg.sender == address(host),
            "RedirectAll: support only one host"
        );
        _;
    }

    modifier onlyExpected(ISuperToken _superToken, address agreementClass) {
        require(_isSameToken(_superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }

    // endregion Super App Calbacks

    // ============= =============  Gelato TASKS  ============= ============= //
    // #region Gelato Tasks

    /// Task1 push erc20 to aave

    function createStopStreamTask(address _member, uint256 _duration)
        internal
        returns (bytes32 taskId)
    {
        taskId = IOps(ops).createTimedTask(
            uint128(block.timestamp + _duration),
            600,
            address(this),
            this.stopStreamExec.selector,
            address(this),
            abi.encodeWithSelector(this.checkStopStream.selector, _member),
            ETH,
            false
        );
    }

    // called by Gelato Execs
    function checkStopStream(address _receiver)
        external pure
        returns (bool canExec, bytes memory execPayload)
    {
        canExec = true;

        execPayload = abi.encodeWithSelector(
            this.stopStreamExec.selector,
            address(_receiver)
        );
    }

    /// called by Gelato
    function stopStreamExec (
        address _receiver
    ) external onlyOps {
        //// check if

        _poolRebalance();
    

        //// every task will be payed with a transfer, therefore receive(), we have to fund the contract
        uint256 fee;
        address feeToken;

        (fee, feeToken) = IOps(ops).getFeeDetails();

        _transfer(fee, feeToken);

        (, int96 inFlowRate, , ) = cfa.getFlow(
            superToken,
            _receiver,
            address(this)
        );

        if (inFlowRate > 0) {
            _cfaLib.deleteFlow(_receiver, address(this), superToken);
            _updateFlow(_receiver, 0,0,0);
        }

    }

    modifier onlyOps() {
        require(msg.sender == ops, "OpsReady: onlyOps");
        _;
    }

    function cancelTask(bytes32 _taskId) public {
        IOps(ops).cancelTask(_taskId);
    }

    function withdraw() external returns (bool) {
        (bool result, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        return result;
    }

    receive() external payable {}

    function _transfer(uint256 _amount, address _paymentToken) internal {
        if (_paymentToken == ETH) {
            (bool success, ) = gelato.call{value: _amount}("");
            require(success, "_transfer: ETH transfer failed");
        } else {
            SafeERC20.safeTransfer(IERC20(_paymentToken), gelato, _amount);
        }
    }

    // #endregion Gelato functions



    // ============= =============  EPNS  ============= ============= //
    // #region  EPNS

      function sendNotif() public {

      IPUSHCommInterface(epnsComm).sendNotification(
          epnsChannel, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
          address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
          bytes(
              string(
                  // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                  abi.encodePacked(
                      "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                      "+", // segregator
                      "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                      "+", // segregator
                      "Title", // this is notificaiton title
                      "+", // segregator
                      "Body" // notification body
                  )
              )
          )
      );
      }

     // endregion EPNS 
}
