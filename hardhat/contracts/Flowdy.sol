//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "hardhat/console.sol";

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

contract Flowdy is SuperAppBase, OpsReady, IERC777Recipient {
    // ... rest of your contract ...
    uint256 MAX_INT;

    ISuperfluid public host; // host
    IConstantFlowAgreementV1 public cfa; // the stored constant flow agreement class address
    ISuperToken superToken;

    IERC20 token;
    IERC20 aToken;

    IPool pool;

    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData internal _cfaLib;



    constructor(
        ISuperfluid _host,
        ISuperToken _superToken,
        IERC20 _token,
        IPool _pool,
        IERC20 _aToken
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

        token.approve(
            address(0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6),
            MAX_INT
        );

        MAX_INT = 2**256 - 1;

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

    function deposit() public {
     

        pool.supply(
            address(token),
            10000000,
            address(this),
            0
        );
    }

    function depositx() public {
        console.log(25);

        IPoolAddressesProvider provider = IPoolAddressesProvider(
            address(0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D)
        );

        address pool = provider.getPool();
        console.log(33, pool);
        // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
        //lendingPool = IPool(address(0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6));

        // Input variables

        uint256 amount = 1000 * 1e18;
        uint16 referral = 0;
        //console.log(address(lendingPool));
        // IERC20(usdcAddress).approve(address(0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6), amount);
        // lendingPool.deposit(daiAddress, amount, referral);
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

        //_deposit(from, from, amount);
    }
}
