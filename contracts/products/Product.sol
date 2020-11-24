// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 < 0.8.0;

import "../tokens/FundingToken.sol";

abstract contract Product {
    event LogProductContributed(
        address indexed contributor,
        uint256 indexed amount
    );
    event LogFundingCapReached(uint256 indexed time, uint256 funding);
    event LogRefund(
        address indexed contributor,
        address indexed project,
        uint256 indexed amount
    );
    event LogPayout(address indexed beneficiary, uint256 indexed payout);

    enum ProductFundingStatus {Active, Expired, Closed}

    enum FundingStage {
        Open,
        FundingRaised,
        CapReached,
        EarlySuccess,
        Success,
        PaidOut,
        Failed
    }

    // Define enum 'ProductSupplyChainState' with the following values:
    enum ProductSupplyChainState {
        ProposalPublished, // 0
        RequiredFundingAchieved, // 1
        Harvested, // 2
        Processed, // 3
        Packed, // 4
        ForSale, // 5
        Sold, // 6
        Shipped, // 7
        Received, // 8
        Purchased // 9
    }

    ProductSupplyChainState constant defaultProductSupplyChainState = ProductSupplyChainState
        .ProposalPublished;

    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint256 upc;
    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint256 sku;
    address payable ownerID; // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address payable originFarmerID; // Metamask-Ethereum address of the Farmer
    string originFarmName; // Farmer Name
    string originFarmInformation; // Farmer Information
    string originFarmLatitude; // Farm Latitude
    string originFarmLongitude; // Farm Longitude
    uint256 productID; // Product ID potentially a combination of upc + sku
    string productNotes; // Product Notes
    uint256 productPrice; // Product Price
    ProductSupplyChainState itemProductSupplyChainState; // Product ProductSupplyChainState as represented in the enum above
    address payable distributorID; // Metamask-Ethereum address of the Distributor
    address payable retailerID; // Metamask-Ethereum address of the Retailer
    address payable consumerID; // Metamask-Ethereum address of the Consumer

    uint256 createdAtBlock;
    uint256 creationTime;
    uint256 public deadline;
    uint256 public fundingCap;
    address public beneficiary;

    ProductFundingStatus status;
    FundingStage stage;
    FundingToken public fundingToken;

    constructor(
        address _creator,
        uint256 _fundingCap,
        uint256 _deadline
    ) {
        beneficiary = _creator;
        fundingCap = _fundingCap;
        creationTime = block.timestamp;
        deadline = _deadline;
        fundingToken = new FundingToken();
        stage = FundingStage.Open;
        status = ProductFundingStatus.Active;
    }

    function fund(uint256 _funding, address investor) public virtual;

    function refund() public virtual;

    function payout() public virtual;

    function amountRaised() public view returns (uint256 amount) {
        amount = fundingToken.balanceOf(address(this));
    }
}
