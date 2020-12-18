// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

//pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;
import "./base/Ownable.sol";

// Manages product supplychain stage transitions
contract SupplychainHub is Ownable {
    enum SupplychainStage {
        DefaultState, //0
        ProductPublished, //1
        ProductFunded, //2
        Harvested, //3
        OnSale, //4
        Sold //5
    }
    uint256 public upc;
    //address payable public owner;
    mapping(uint256 => SupplychainStage) upcToSupplychainStage;
    mapping(address => mapping(uint256 => uint256)) payablesToProductIdToAmount;
    mapping(uint256 => address[]) payablesForProductIDLUT;
    mapping(uint256 => mapping(address => bool)) payablesForProductIDFlagged;

    constructor() public Ownable() {
        upc = 1;
        //owner=msg.sender;
    }

    /**
     *  Return payout amount owed to investor for a particular harvested product
     */
    function getPayoutAmountForContributor(
        uint256 _universalProductCode,
        address payable contributor
    ) public view returns (uint256) {
        return payablesToProductIdToAmount[contributor][_universalProductCode];
    }

    /**
     * Add contributors elligible for payout on harvest
     *
     */
    function acceptFundsFromSender(
        uint256 _universalProductCode,
        address payable contributor,
        uint256 amount
    ) public returns (bool) {
        payablesToProductIdToAmount[contributor][_universalProductCode] += amount;
        payablesForProductIDLUT[_universalProductCode].push(contributor);
        payablesForProductIDFlagged[_universalProductCode][contributor] = true;
        return true;
    }

    /**
     * Mark contributors as paid after product has been harvested
     *
     */
    function markFundsReleasedToContributor(
        uint256 _universalProductCode,
        address payable contributor
    ) public returns (bool) {
        payablesToProductIdToAmount[contributor][_universalProductCode] = 0;
        payablesForProductIDFlagged[_universalProductCode][contributor] = false;
        return true;
    }

    /**
     * Get total amount for product owed to investors
     *
     */
    function getPaybleOwedAmountForProduct(
        uint256 _universalProductCode,
        address contributor
    ) public view returns (uint256) {
        return payablesToProductIdToAmount[contributor][_universalProductCode];
    }

    /**
     * Get list of investors for product
     *
     */
    function getListOfPayblesForProduct(uint256 _universalProductCode)
        public
        view
        returns (address[] memory)
    {
        uint8 len = 0;
        for (
            uint256 i = 0;
            i < payablesForProductIDLUT[_universalProductCode].length;
            ++i
        ) {
            if (
                payablesForProductIDFlagged[_universalProductCode][payablesForProductIDLUT[_universalProductCode][i]]
            ) {
                ++len;
            }
        }
        address[] memory listOfPayable = new address[](len);
        len = 0;
        for (
            uint256 i = 0;
            i < payablesForProductIDLUT[_universalProductCode].length;
            ++i
        ) {
            if (
                payablesForProductIDFlagged[_universalProductCode][payablesForProductIDLUT[_universalProductCode][i]]
            ) {
                listOfPayable[len] = payablesForProductIDLUT[_universalProductCode][i];
            }
        }
        return listOfPayable;
    }

    /**
     * Update  product supplychain status
     *
     */
    function updateSupplychainStatus(uint256 _upc, SupplychainStage stage)
        public
        returns (bool)
    {
        upcToSupplychainStage[_upc] = stage;
        return true;
    }

    /**
     * Get product supplychain status
     *
     */
    function getSupplychainStatus(uint256 _upc)
        public
        view
        returns (SupplychainStage)
    {
        return upcToSupplychainStage[_upc];
    }

    /**
     * Increment Product counter
     *
     */
    function incrementProductCodeCounter() public returns (bool) {
        uint256 oldUpc = upc;
        upc += 1;
        return (upc == (oldUpc + 1));
    }
}
