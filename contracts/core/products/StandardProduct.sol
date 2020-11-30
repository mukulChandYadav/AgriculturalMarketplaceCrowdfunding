// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "../../utils/Math.sol";
import "../tokens/FundingToken.sol";
import "../supplychain/SupplychainProduct.sol";

//import '../crowdFunding/CrowdFundedProduct.sol';

contract StandardProduct is SupplychainProduct {
    address payable public ownerID; // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address payable public originFarmerID; // Metamask-Ethereum address of the Farmer
    string public originFarmName; // Farmer Name
    string public originFarmInformation; // Farmer Information
    string public originFarmLatitude; // Farm Latitude
    string public originFarmLongitude; // Farm Longitude
    uint256 public productID; // Product ID potentially a combination of upc + sku
    string productNotes; // Product Notes
    uint256 public productPrice; // Product Price

    address payable public distributorID; // Metamask-Ethereum address of the Distributor
    address payable public retailerID; // Metamask-Ethereum address of the Retailer
    address payable public consumerID; // Metamask-Ethereum address of the Consumer

    // Define a public mapping 'products' that maps the UPC to an Item.
    mapping(uint256 => address) products;

    // Define a public mapping 'productsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping(uint256 => string[]) productHistory;

    constructor(
        uint256 _upc,
        //uint256 _sku,
        address payable _ownerID,
        address payable _originFarmerID,
        string memory _originFarmName,
        string memory _originFarmInformation,
        string memory _originFarmLatitude,
        string memory _originFarmLongitude,
        string memory _productNotes
    ) public SupplychainProduct(_upc) {
        ownerID = _ownerID;
        originFarmerID = _originFarmerID;
        originFarmName = _originFarmName;
        originFarmInformation = _originFarmInformation;
        originFarmLatitude = _originFarmLatitude;
        originFarmLongitude = _originFarmLongitude;
        productNotes = _productNotes;
    }

    event LogStandardProductCreation(
        address indexed productCreator,
        StandardProduct indexed standardProduct
    );
}
