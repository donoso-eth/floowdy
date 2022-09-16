//SPDX-License-Identifier: Unlicense
pragma solidity >=0.4.22 <0.9.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

import {IPoolAddressesProvider} from "./aave/IPoolAddressesProvider.sol";
import {IPool} from "./aave/IPool.sol";

import {ISuperfluid, ISuperAgreement, ISuperToken, ISuperApp, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import {OpsReady} from "./gelato/OpsReady.sol";
import {IOps} from "./gelato/IOps.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {Events} from "./libraries/Events.sol";


contract Floowdy is SuperAppBase, OpsReady, IERC777Recipient {
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

  mapping(address=> DataTypes.Member) public members;
  uint256 totalMembers;

  constructor(
    ISuperfluid _host,
    ISuperToken _superToken,
    IERC20 _token,
    IPool _pool,
    IERC20 _aToken,
    address _ops
  ) {
    require(address(_host) != address(0), "host is zero address");
    require(
      address(_superToken) != address(0),
      "acceptedToken is zero address"
    );
    host = _host;
    superToken = _superToken;
    token = _token;
    pool = _pool;
    aToken = _aToken;

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
    ops = _ops;
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
   * @param from Supplier (user sending tokens / depositing)
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

  function  _getMember(address _member) internal returns(DataTypes.Member storage member) {
    member = members[_member];
    if(member.id == 0) {
       totalMembers++;
       member.id = totalMembers;
       member.member = _member;
    }
   
  }

  function _deposit(address _member, uint256 amount) internal {

    _poolRebalance();
   
    DataTypes.Member storage member = _getMember(_member);

    member.deposit += amount;

    if (member.flow > 0) {
      member.deposit+= uint96(member.flow)*(block.timestamp - member.timestamp);
    }

    member.timestamp = block.timestamp; 
    emit Events.MemberAction(member);


  } 

  // #endregion

  // ============= ============= Pool ============= ============= //
  // #region Pool

    function _poolRebalance() public {

    }

    function _calculateYield() public {

    }

  // #endregion Pool


  // ============= ============= Aave ============= ============= //
    function aaveSupply() public {
    uint256 poolSuperTokenBalance = (superToken.balanceOf(address(this))).div(10**12);

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

    (, int96 inFlowRate, , ) = cfa.getFlow(superToken, sender, address(this));
    ISuperfluid.Context memory decodedContext = host.decodeCtx(_ctx);

    _updateDeposit(sender,inFlowRate);
    
    if (decodedContext.userData.length > 0) {
  
      uint256 duration = parseLoanData(host.decodeCtx(_ctx).userData);
      console.log(180, duration);
      
    } 

    return newCtx;
  }

  ///// NOT YET FINAL IMPLEMNTATION
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

    (, int96 inFlowRate, , ) = cfa.getFlow(superToken, sender, address(this));

    return newCtx;
  }

  // #endregion Super App Calbacks

  /**************************************************************************
   * INTERNAL HELPERS
   *************************************************************************/
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
      keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
  }

  function _isSameToken(ISuperToken _superToken) private view returns (bool) {
    return address(_superToken) == address(superToken);
  }

  // ============= =============  Modifiers ============= ============= //
  // #region Modidiers

  modifier onlyHost() {
    require(msg.sender == address(host), "RedirectAll: support only one host");
    _;
  }

  modifier onlyExpected(ISuperToken _superToken, address agreementClass) {
    require(_isSameToken(_superToken), "RedirectAll: not accepted token");
    require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
    _;
  }

  // endregion
}
