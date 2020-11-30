// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

//import '../products/StandardProduct.sol';
//import '../crowdFunding/StandardFundingHub.sol';
//import '../registration/StandardRegisterUserHub.sol';

// // Define a contract 'SupplychainHub'
// abstract contract SupplychainHub is
//     StandardRegisterUserHub,
//     StandardProduct
// {

//     // Define a public mapping 'products' that maps the UPC to an Item.
//     mapping(uint256 => address) products;

//     // Define a public mapping 'productsHistory' that maps the UPC to an array of TxHash,
//     // that track its journey through the supply chain -- to be sent from DApp.
//     mapping(uint256 => string[]) productHistory;

//     // Define 10 events with the same 10 state values and accept 'upc' as input argument
//     event ProposalPublished(uint256 upc);
//     event RequiredFundingAchieved(uint256 upc);
//     event Harvested(uint256 upc);
//     event Processed(uint256 upc);
//     event Packed(uint256 upc);
//     event ForSale(uint256 upc);
//     event Sold(uint256 upc);
//     event Shipped(uint256 upc);
//     event Received(uint256 upc);
//     event Purchased(uint256 upc);

//     // Define a function 'harvestItem' that allows a farmer to mark an item 'Harvested'
//     function harvestItem(
//         uint256 _upc,
//         address payable _originFarmerID,
//         string memory _originFarmName,
//         string memory _originFarmInformation,
//         string memory _originFarmLatitude,
//         string memory _originFarmLongitude,
//         string memory productNotes
//     )
//         public virtual;

//     // Define a function 'processtItem' that allows a farmer to mark an item 'Processed'
//     function processItem(uint256 _upc)
//         public virtual;

//     // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
//     function packItem(uint256 _upc)
//         public virtual;

//     // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
//     function sellItem(uint256 _upc, uint256 _price)
//         public virtual;

//     // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
//     // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
//     // and any excess ether sent is refunded back to the buyer
//     function buyItem(uint256 _upc)
//         public
//         payable virtual;

//     // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
//     // Use the above modifers to check if the item is sold
//     function shipItem(uint256 _upc)
//         public virtual;

//     // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
//     // Use the above modifiers to check if the item is shipped
//     function receiveItem(uint256 _upc)
//         public virtual;

//     // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
//     // Use the above modifiers to check if the item is received
//     function purchaseItem(uint256 _upc)
//         public
//         payable virtual;

//     /*
//   // Define a function 'fetchItemBufferOne' that fetches the data
//   function fetchItemBufferOne(uint _upc) public view returns
//   (
//   uint    itemSKU,
//   uint    itemUPC,
//   address ownerID,
//   address originFarmerID,
//   string  memory originFarmName,
//   string  memory originFarmInformation,
//   string  memory originFarmLatitude,
//   string  memory originFarmLongitude
//   )
//   {
//   // Assign values to the 8 parameters
//   Item memory existingItem = products[_upc];

//   itemSKU = existingItem.sku;
//   itemUPC = existingItem.upc;
//   ownerID = existingItem.ownerID;
//   originFarmerID = existingItem.originFarmerID;
//   originFarmName = existingItem.originFarmName;
//   originFarmInformation = existingItem.originFarmInformation;
//   originFarmLatitude = existingItem.originFarmLatitude;
//   originFarmLongitude = existingItem.originFarmLongitude;

//   return
//   (
//   itemSKU,
//   itemUPC,
//   ownerID,
//   originFarmerID,
//   originFarmName,
//   originFarmInformation,
//   originFarmLatitude,
//   originFarmLongitude
//   );
//   }

//   // Define a function 'fetchItemBufferTwo' that fetches the data
//   function fetchItemBufferTwo(uint _upc) public view returns
//   (
//   uint    itemSKU,
//   uint    itemUPC,
//   uint    productID,
//   string  memory productNotes,
//   uint    productPrice,
//   uint    itemProductSupplyChainState,
//   address distributorID,
//   address retailerID,
//   address consumerID
//   )
//   {
//     // Assign values to the 9 parameters
//   Item memory existingItem = products[_upc];
//   itemSKU = existingItem.sku;
//   itemUPC = existingItem.upc;
//   productID = existingItem.productID;
//   productNotes = existingItem.productNotes;
//   productPrice = existingItem.productPrice;
//   itemProductSupplyChainState = uint(existingItem.itemProductSupplyChainState);
//   distributorID = existingItem.distributorID;
//   retailerID = existingItem.retailerID;
//   consumerID = existingItem.consumerID;

//   return
//   (
//   itemSKU,
//   itemUPC,
//   productID,
//   productNotes,
//   productPrice,
//   itemProductSupplyChainState,
//   distributorID,
//   retailerID,
//   consumerID
//   );
//   }
//   */
// }
