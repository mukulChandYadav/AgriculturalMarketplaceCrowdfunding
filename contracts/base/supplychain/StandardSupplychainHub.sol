// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './SupplychainHub.sol';

// Define a contract 'Supplychain'
contract Supplychain is
    StandardSupplychainHub
{



    enum UserRoleType {
        DefaultPlaceholder,
        Farmer,
        Donor,
        Investor,
        ForwardMarketConsumer,
        SportMarketConsumer
    }

    

    // Define 10 events with the same 10 state values and accept 'upc' as input argument
    event ProposalPublished(uint256 upc);
    event RequiredFundingAchieved(uint256 upc);
    event Harvested(uint256 upc);
    event Processed(uint256 upc);
    event Packed(uint256 upc);
    event ForSale(uint256 upc);
    event Sold(uint256 upc);
    event Shipped(uint256 upc);
    event Received(uint256 upc);
    event Purchased(uint256 upc);

    // Define a modifer that verifies the Caller
    modifier verifyCaller(address _address) {
        require(
            msg.sender == _address,
            "This account is not the owner of this item"
        );
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint256 _price) {
        require(
            msg.value >= _price,
            "The amount sent is not sufficient for the price"
        );
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValueForDistributor(uint256 _upc) {
        _;
        uint256 _price = items[_upc].productPrice;
        uint256 amountToReturn = msg.value - _price;
        items[_upc].distributorID.transfer(amountToReturn);
    }

    // Define a modifier that checks the price and refunds the remaining balance
    // to the Consumer
    modifier checkValueForConsumer(uint256 _upc) {
        _;
        uint256 _price = items[_upc].productPrice;
        uint256 amountToReturn = msg.value - _price;
        items[_upc].consumerID.transfer(amountToReturn);
    }

    // Define a modifier that checks if an item.state of a upc is Harvested
    modifier harvested(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Harvested,
            "The Item is not in Harvested state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Processed
    modifier processed(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Processed,
            "The Item is not in Processed state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Packed
    modifier packed(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Packed,
            "The Item is not in Packed state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is ForSale
    modifier forSale(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.ForSale,
            "The Item is not in ForSale state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Sold
    modifier sold(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Sold,
            "The Item is not in Sold state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Shipped
    modifier shipped(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Shipped,
            "The Item is not in Shipped state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Received
    modifier received(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Received,
            "The Item is not in Received state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Purchased
    modifier purchased(uint256 _upc) {
        require(
            items[_upc].itemProductSupplyChainState == ProductSupplyChainState.Purchased,
            "The Item is not in Purchased state!"
        );
        _;
    }

    modifier onlyConsumer() {
        require(
            (isForwardMarketConsumer(msg.sender) == true) ||
                (isSpotMarketConsumer(msg.sender) == true)
        );
        _;
    }

    // and set 'sku' to 1
    // and set 'upc' to 1
    // Using Ownable to define the ownwerm
    constructor() public payable {

    }

    // Define a function 'harvestItem' that allows a farmer to mark an item 'Harvested'
    function harvestItem(
        uint256 _upc,
        address payable _originFarmerID,
        string memory _originFarmName,
        string memory _originFarmInformation,
        string memory _originFarmLatitude,
        string memory _originFarmLongitude,
        string memory productNotes
    )
        public
        //Only Farmer
        onlyFarmer
    {
        // Add the new item as part of Harvest
        Item memory newItem;
        newItem.upc = _upc;
        newItem.ownerID = _originFarmerID;
        newItem.originFarmerID = _originFarmerID;
        newItem.originFarmName = _originFarmName;
        newItem.originFarmInformation = _originFarmInformation;
        newItem.originFarmLatitude = _originFarmLatitude;
        newItem.originFarmLongitude = _originFarmLongitude;
        newItem.productNotes = productNotes;
        newItem.sku = sku;
        newItem.productID = _upc + sku;
        // Increment sku
        sku = sku + 1;
        // Setting state
        newItem.itemProductSupplyChainState = ProductSupplyChainState.Harvested;
        // Adding new Item to map
        items[_upc] = newItem;
        // Emit the appropriate event
        emit Harvested(_upc);
    }

    // Define a function 'processtItem' that allows a farmer to mark an item 'Processed'
    function processItem(uint256 _upc)
        public
        //Only Farmer
        onlyFarmer
        // Call modifier to check if upc has passed previous supply chain stage
        harvested(_upc)
        // Call modifier to verify caller of this function
        verifyCaller(items[_upc].originFarmerID)
    {
        // Update the appropriate fields
        Item storage existingItem = items[_upc];
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Processed;
        // Emit the appropriate event
        emit Processed(_upc);
    }

    // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
    function packItem(uint256 _upc)
        public
        //Only Farmer
        onlyFarmer
        // Call modifier to check if upc has passed previous supply chain stage
        processed(_upc)
        // Call modifier to verify caller of this function
        verifyCaller(items[_upc].originFarmerID)
    {
        // Update the appropriate fields
        Item storage existingItem = items[_upc];
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Packed;
        // Emit the appropriate event
        emit Packed(_upc);
    }

    // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
    function sellItem(uint256 _upc, uint256 _price)
        public
        //Only Farmer
        onlyFarmer
        // Call modifier to check if upc has passed previous supply chain stage
        packed(_upc)
        // Call modifier to verify caller of this function
        verifyCaller(items[_upc].originFarmerID)
    {
        // Update the appropriate fields
        Item storage existingItem = items[_upc];
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.ForSale;
        existingItem.productPrice = _price;
        // Emit the appropriate event
        emit ForSale(_upc);
    }

    // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
    // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
    // and any excess ether sent is refunded back to the buyer
    function buyItem(uint256 _upc)
        public
        payable
        // Only Consumer
        onlyConsumer
        // Call modifier to check if upc has passed previous supply chain stage
        forSale(_upc)
        // Call modifer to check if buyer has paid enough
        paidEnough(items[_upc].productPrice)
        // Call modifer to send any excess ether back to buyer
        checkValueForDistributor(_upc)
    {
        // Update the appropriate fields - ownerID, distributorID, itemProductSupplyChainState
        Item storage existingItem = items[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Sold;
        existingItem.distributorID = msg.sender;
        // Transfer money to farmer
        uint256 productPrice = items[_upc].productPrice;
        items[_upc].originFarmerID.transfer(productPrice);
        // emit the appropriate event
        emit Sold(_upc);
    }

    // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
    // Use the above modifers to check if the item is sold
    function shipItem(uint256 _upc)
        public
        // Only Distributor
        onlyFarmer
        // Call modifier to check if upc has passed previous supply chain stage
        sold(_upc)
        // Call modifier to verify caller of this function
        verifyCaller(items[_upc].distributorID)
    {
        // Update the appropriate fields
        Item storage existingItem = items[_upc];
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Shipped;
        // Emit the appropriate event
        emit Shipped(_upc);
    }

    // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
    // Use the above modifiers to check if the item is shipped
    function receiveItem(uint256 _upc)
        public
        // Only Retailer
        onlyConsumer
        // Call modifier to check if upc has passed previous supply chain stage
        shipped(_upc)
    // Access Control List enforced by calling Smart Contract / DApp
    {
        // Update the appropriate fields - ownerID, retailerID, itemProductSupplyChainState
        Item storage existingItem = items[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Received;
        existingItem.retailerID = msg.sender;
        // Emit the appropriate event
        emit Received(_upc);
    }

    // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
    // Use the above modifiers to check if the item is received
    function purchaseItem(uint256 _upc)
        public
        payable
        //Only Consumer
        onlyConsumer
        // Call modifier to check if upc has passed previous supply chain stage
        received(_upc)
        // Make sure paid enough
        paidEnough(items[_upc].productPrice)
        // Access Control List enforced by calling Smart Contract / DApp
        checkValueForConsumer(_upc)
    {
        // Update the appropriate fields - ownerID, consumerID, itemProductSupplyChainState
        Item storage existingItem = items[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.itemProductSupplyChainState = ProductSupplyChainState.Purchased;
        existingItem.consumerID = msg.sender;
        // Emit the appropriate event
        emit Purchased(_upc);
    }


    /*
  // Define a function 'fetchItemBufferOne' that fetches the data
  function fetchItemBufferOne(uint _upc) public view returns
  (
  uint    itemSKU,
  uint    itemUPC,
  address ownerID,
  address originFarmerID,
  string  memory originFarmName,
  string  memory originFarmInformation,
  string  memory originFarmLatitude,
  string  memory originFarmLongitude
  ) 
  {
  // Assign values to the 8 parameters
  Item memory existingItem = items[_upc];

  itemSKU = existingItem.sku;
  itemUPC = existingItem.upc;
  ownerID = existingItem.ownerID;
  originFarmerID = existingItem.originFarmerID;
  originFarmName = existingItem.originFarmName;
  originFarmInformation = existingItem.originFarmInformation;
  originFarmLatitude = existingItem.originFarmLatitude;
  originFarmLongitude = existingItem.originFarmLongitude;

  return 
  (
  itemSKU,
  itemUPC,
  ownerID,
  originFarmerID,
  originFarmName,
  originFarmInformation,
  originFarmLatitude,
  originFarmLongitude
  );
  }

  // Define a function 'fetchItemBufferTwo' that fetches the data
  function fetchItemBufferTwo(uint _upc) public view returns 
  (
  uint    itemSKU,
  uint    itemUPC,
  uint    productID,
  string  memory productNotes,
  uint    productPrice,
  uint    itemProductSupplyChainState,
  address distributorID,
  address retailerID,
  address consumerID
  ) 
  {
    // Assign values to the 9 parameters
  Item memory existingItem = items[_upc];
  itemSKU = existingItem.sku;
  itemUPC = existingItem.upc;
  productID = existingItem.productID;
  productNotes = existingItem.productNotes;
  productPrice = existingItem.productPrice;
  itemProductSupplyChainState = uint(existingItem.itemProductSupplyChainState);
  distributorID = existingItem.distributorID;
  retailerID = existingItem.retailerID;
  consumerID = existingItem.consumerID;
  
  return 
  (
  itemSKU,
  itemUPC,
  productID,
  productNotes,
  productPrice,
  itemProductSupplyChainState,
  distributorID,
  retailerID,
  consumerID
  );
  }
  */
}
