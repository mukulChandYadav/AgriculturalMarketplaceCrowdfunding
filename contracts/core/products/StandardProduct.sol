// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "../supplychain/SupplychainProduct.sol";

//import '../crowdFunding/CrowdFundedProduct.sol';

contract StandardProduct is SupplychainProduct {
    address payable public ownerID; // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address payable public originFarmerID; // Metamask-Ethereum address of the Farmer
    string public originFarmName; // Farm Name
    string public productNotes; // Product Notes
    uint256 public productPrice; // Product Price


    // Define a public mapping 'products' that maps the UPC to an Item.
    mapping(uint256 => address) products;


    constructor(
        uint256 _upc,
        uint256 _sku,
        address payable _ownerID,
        string memory _originFarmName,
        string memory _productNotes
    ) public SupplychainProduct(_upc,_sku) {
        ownerID = _ownerID;
        originFarmerID = _ownerID;
        originFarmName = _originFarmName;
        productNotes = _productNotes;
    }

    event LogStandardProductCreation (
        address indexed productCreator,
        StandardProduct indexed standardProduct
    )  ;



    // Define a function 'harvestProduct' that allows a farmer to mark an item 'Harvested'
    function harvestProduct() public override virtual returns (bool)
    {
        require(super.harvestProduct());
        return true;
    }
}
