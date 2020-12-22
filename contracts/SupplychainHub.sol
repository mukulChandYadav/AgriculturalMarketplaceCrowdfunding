// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

//pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;
import "./base/Ownable.sol";
import "./registration/StandardRegisterUserHub.sol";

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
    mapping(address => mapping(uint256 => uint256)) contributorsToProductIdToAmount;
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
        // require(
        //     contributorsToProductIdToAmount[contributor][_universalProductCode] >
        //         0,
        //     "Given Account made no contribution to given product campaign"
        // );
        // require(
        //     payablesForProductIDFlagged[_universalProductCode][contributor] ==
        //         true,
        //     "No contribution transactions were recorded from this account for given product campaign"
        // );
        return
            contributorsToProductIdToAmount[contributor][_universalProductCode];
    }

    /**
     *  Return contributed amount from Donor/Investor for a particular harvested product
     */
    function getContributedAmountForContributor(
        uint256 _universalProductCode,
        address payable contributor
    ) public view returns (uint256) {
        require(
            contributorsToProductIdToAmount[contributor][_universalProductCode] >
                0,
            "No contribution transactions were recorded from this account for given product campaign"
        );
        return
            contributorsToProductIdToAmount[contributor][_universalProductCode];
    }

    /**
     * Add contributors elligible for payout on harvest
     *
     */
    function acceptFundsFromSender(
        uint256 _universalProductCode,
        uint256 userRoleType,
        address payable contributor,
        uint256 amount
    ) public returns (bool) {
        contributorsToProductIdToAmount[contributor][_universalProductCode] += amount;

        // Add to payables for Investor role type users
        if (
            userRoleType == 3
            //(uint256)(StandardRegisterUserHub.UserRoleType.Investor)
        ) {
            if (
                !payablesForProductIDFlagged[_universalProductCode][contributor]
            ) {
                payablesForProductIDLUT[_universalProductCode].push(
                    contributor
                );
            }
            payablesForProductIDFlagged[_universalProductCode][contributor] = true;
        }
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
        contributorsToProductIdToAmount[contributor][_universalProductCode] = 0;
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
        return
            contributorsToProductIdToAmount[contributor][_universalProductCode];
    }

    /**
     * Get Investor from list of investors for a product
     *
     */
    function getFromListOfPayblesForProduct(
        uint256 _universalProductCode,
        uint256 entryNum
    ) public view returns (address) {
        require(
            entryNum < payablesForProductIDLUT[_universalProductCode].length,
            "Entry number exceeds number of contributors"
        );
        return payablesForProductIDLUT[_universalProductCode][entryNum];
    }

    /**
     * Get total number of investors for a product
     *
     */
    function getNumberOfPayblesForProduct(uint256 _universalProductCode)
        public
        view
        returns (uint256)
    {
        return payablesForProductIDLUT[_universalProductCode].length;
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
