// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "../crowdFunding/StandardFundingHub.sol";
import "../base/Ownable.sol";
import "../registration/StandardRegisterUserHub.sol";

// Define a contract 'StandardSupplychainHub'
contract StandardSupplychainHub is StandardRegisterUserHub, StandardFundingHub {
    // Define a public mapping 'productsHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping(uint256 => string[]) productHistory;

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
    // modifier checkValueForDistributor(uint256 _upc) {
    //     _;
    //     StandardProduct product = StandardProduct(products[_upc]);
    //     uint256 _price = product.productPrice();
    //     uint256 amountToReturn = msg.value - _price;
    //     product.distributorID().transfer(amountToReturn);
    // }

    // Define a modifier that checks the price and refunds the remaining balance
    // to the Consumer
    // modifier checkValueForConsumer(uint256 _upc) {
    //     _;
    //     StandardProduct product = StandardProduct(products[_upc]);
    //     uint256 _price = product.productPrice();
    //     uint256 amountToReturn = msg.value - _price;
    //     product.consumerID().transfer(amountToReturn);
    // }

    modifier onlyConsumer() {
        require(
            (isForwardMarketConsumer(msg.sender) == true) ||
                (isSpotMarketConsumer(msg.sender) == true)
        );
        _;
    }

    // Define a function 'publishCrowdfundingProposal' that allows a farmer to mark an item ready for crowdfunding
    function publishCrowdfundingProposal(
        uint256 sku,
        address payable _originFarmerID,
        string memory _originFarmName,
        string memory _productNotes,
        uint256 _fundingCap,
        uint256 _deadline
    )
        public
        //Only Farmer
        onlyFarmer
    {
        // Add the new product for crowdfunding
        CrowdFundedProduct newProduct = createProduct(
            sku,
            _originFarmerID,
            _originFarmName,
            _productNotes,
            _fundingCap,
            _deadline
        );
        
        productHistory[SupplychainProduct(newProduct).upc()].push("Proposal Published");
        //emit ProposalPublished(_upc);
    }

    // Define a function 'harvestProduct' that allows a farmer to mark an item 'Harvested'
    function harvestProduct(uint256 _upc)
        public
        onlyFarmer
        verifyCaller(productAddrs[_upc])
        returns (bool)
    {
        require(CrowdFundedProduct(productAddrs[_upc]).harvestProduct());
        return true;
    }

    // Define a function 'sellProduct' that allows a farmer to mark an item 'ForSale'
    function sellProduct(uint256 _upc, uint256 _price)
        public
        onlyFarmer
        // Call modifier to verify caller of this function
        verifyCaller(productAddrs[_upc])
    {
        // Update the appropriate fields
        // StandardProduct existingProduct = StandardProduct(products[_upc]);
        // existingProduct.updateProductStatus(ProductSupplyChainState.ForSale);
        //existingProduct.productPrice = _price;
        // Emit the appropriate event
        // emit ForSale(_upc);
    }

    // // Define a function 'processtProduct' that allows a farmer to mark an item 'Processed'
    // function processProduct(uint256 _upc)
    //     public
    //     //Only Farmer
    //     onlyFarmer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     harvested(_upc)
    // // Call modifier to verify caller of this function
    // // verifyCaller(StandardProduct(products[_upc]).originFarmerID())
    // {
    //     // Update the appropriate fields
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     existingProduct.updateProductStatus(ProductSupplyChainState.Processed);
    //     // Emit the appropriate event
    //     emit Processed(_upc);
    // }

    // // Define a function 'packProduct' that allows a farmer to mark an item 'Packed'
    // function packProduct(uint256 _upc)
    //     public
    //     //Only Farmer
    //     onlyFarmer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     processed(_upc)
    // // Call modifier to verify caller of this function
    // // verifyCaller(StandardProduct(products[_upc]).originFarmerID())
    // {
    //     // Update the appropriate fields
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     existingProduct.updateProductStatus(ProductSupplyChainState.Packed);
    //     // Emit the appropriate event
    //     emit Packed(_upc);
    // }

    // // Define a function 'buyProduct' that allows the disributor to mark an item 'Sold'
    // // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
    // // and any excess ether sent is refunded back to the buyer
    // function buyProduct(uint256 _upc)
    //     public
    //     payable
    //     // Only Consumer
    //     onlyConsumer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     forSale(_upc)
    //     // Call modifer to check if buyer has paid enough
    //     /// paidEnough(StandardProduct(products[_upc]).productPrice())
    //     // Call modifer to send any excess ether back to buyer
    //     checkValueForDistributor(_upc)
    // {
    //     // Update the appropriate fields - ownerID, distributorID, itemProductSupplyChainState
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     //existingProduct.ownerID = msg.sender;
    //     existingProduct.updateProductStatus(ProductSupplyChainState.Sold);
    //     //existingProduct.distributorID = msg.sender;
    //     // Transfer money to farmer
    //     uint256 productPrice = StandardProduct(products[_upc]).productPrice();
    //     StandardProduct(products[_upc]).originFarmerID().transfer(productPrice);
    //     // emit the appropriate event
    //     emit Sold(_upc);
    // }

    // // Define a function 'shipProduct' that allows the distributor to mark an item 'Shipped'
    // // Use the above modifers to check if the item is sold
    // function shipProduct(uint256 _upc)
    //     public
    //     // Only Distributor
    //     onlyFarmer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     sold(_upc)
    // // Call modifier to verify caller of this function
    // //verifyCaller(StandardProduct(products[_upc]).distributorID())
    // {
    //     // Update the appropriate fields
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     existingProduct.updateProductStatus(ProductSupplyChainState.Shipped);
    //     // Emit the appropriate event
    //     emit Shipped(_upc);
    // }

    // // Define a function 'receiveProduct' that allows the retailer to mark an item 'Received'
    // // Use the above modifiers to check if the item is shipped
    // function receiveProduct(uint256 _upc)
    //     public
    //     // Only Retailer
    //     onlyConsumer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     shipped(_upc)
    // // Access Control List enforced by calling Smart Contract / DApp
    // {
    //     // Update the appropriate fields - ownerID, retailerID, itemProductSupplyChainState
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     //existingProduct.ownerID = msg.sender;
    //     //TODO: Replicate from above
    //     //existingProduct.itemProductSupplyChainState = ProductSupplyChainState.Received;
    //     //existingProduct.retailerID = msg.sender;
    //     // Emit the appropriate event
    //     emit Received(_upc);
    // }

    // // Define a function 'purchaseProduct' that allows the consumer to mark an item 'Purchased'
    // // Use the above modifiers to check if the item is received
    // function purchaseProduct(uint256 _upc)
    //     public
    //     payable
    //     //Only Consumer
    //     onlyConsumer
    //     // Call modifier to check if upc has passed previous supply chain stage
    //     received(_upc)
    //     // Make sure paid enough
    //     // paidEnough(StandardProduct(products[_upc]).productPrice())
    //     // Access Control List enforced by calling Smart Contract / DApp
    //     checkValueForConsumer(_upc)
    // {
    //     // Update the appropriate fields - ownerID, consumerID, itemProductSupplyChainState
    //     StandardProduct existingProduct = StandardProduct(products[_upc]);
    //     //existingProduct.ownerID = msg.sender;
    //     //TODO: Replicate from above
    //     //existingProduct.itemProductSupplyChainState = ProductSupplyChainState.Purchased;
    //     //existingProduct.consumerID = msg.sender;
    //     // Emit the appropriate event
    //     emit Purchased(_upc);
    // }

    /*
  // Define a function 'fetchProductBufferOne' that fetches the data
  function fetchProductBufferOne(uint _upc) public view returns
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
  Product memory existingProduct = products[_upc];

  itemSKU = existingProduct.sku;
  itemUPC = existingProduct.upc;
  ownerID = existingProduct.ownerID;
  originFarmerID = existingProduct.originFarmerID;
  originFarmName = existingProduct.originFarmName;
  originFarmInformation = existingProduct.originFarmInformation;
  originFarmLatitude = existingProduct.originFarmLatitude;
  originFarmLongitude = existingProduct.originFarmLongitude;

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

  // Define a function 'fetchProductBufferTwo' that fetches the data
  function fetchProductBufferTwo(uint _upc) public view returns 
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
  Product memory existingProduct = products[_upc];
  itemSKU = existingProduct.sku;
  itemUPC = existingProduct.upc;
  productID = existingProduct.productID;
  productNotes = existingProduct.productNotes;
  productPrice = existingProduct.productPrice;
  itemProductSupplyChainState = uint(existingProduct.itemProductSupplyChainState);
  distributorID = existingProduct.distributorID;
  retailerID = existingProduct.retailerID;
  consumerID = existingProduct.consumerID;
  
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
