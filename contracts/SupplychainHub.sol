// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

//pragma experimental ABIEncoderV2;

//pragma solidity ^0.5.0;
import "./base/Ownable.sol";

contract SupplychainHub is Ownable {
    enum SupplychainStage {
        DefaultState,
        ProductPublished, //TODO: Add funding deadline
        ProductFunded,
        Harvested,
        OnSale,
        Sold
    }
    uint256 public upc;
    mapping(uint256 => SupplychainStage) upcToSupplychainStage;
    mapping(address => mapping(uint256 => uint256)) payablesToProductIdToAmount;
    mapping(uint256 => address[]) payablesForProductIDLUT;
    mapping(uint256 => mapping(address => bool)) payablesForProductIDFlagged;

    constructor() public {
        upc = 1;
    }

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

    function markFundsReleasedToContributor(
        uint256 _universalProductCode,
        address payable contributor
    ) public returns (bool) {
        payablesToProductIdToAmount[contributor][_universalProductCode] = 0;
        payablesForProductIDFlagged[_universalProductCode][contributor] = false;
        return true;
    }

    function getPaybleOwedAmountForProduct(
        uint256 _universalProductCode,
        address contributor
    ) public view returns (uint256) {
        return payablesToProductIdToAmount[contributor][_universalProductCode];
    }

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

    function updateSupplychainStatus(uint256 _upc, SupplychainStage stage)
        public
        returns (bool)
    {
        upcToSupplychainStage[_upc] = stage;
        return true;
    }

    function getSupplychainStatus(uint256 _upc)
        public
        view
        returns (SupplychainStage)
    {
        return upcToSupplychainStage[_upc];
    }

    function incrementProductCodeCounter() public returns (bool) {
        uint256 oldUpc = upc;
        upc += 1;
        return (upc == (oldUpc + 1));
    }
}
