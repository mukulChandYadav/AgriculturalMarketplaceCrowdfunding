// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import '../tokens/FundingToken.sol';
import '../crowdFunding/CrowdFundedProduct.sol';
import '../base/Ownable.sol';

contract SupplychainProduct is Ownable{


    // Define enum 'ProductSupplyChainState' with the following values:
    enum ProductSupplyChainState {
        ProductErrorState, //0
        ProposalPublished, // 1
        RequiredFundingAchieved, // 2
        Harvested, // 3
        Processed, // 4
        Packed, // 5
        ForSale, // 6
        Sold, // 7
        Shipped, // 8
        Received, // 9
        Purchased // 10
    }

// Define a variable called 'upc' for Universal Product Code (UPC)
    uint256 public upc;
    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    //uint256 public sku;
    ProductSupplyChainState constant defaultProductSupplyChainState = ProductSupplyChainState
        .ProposalPublished;

    // Product ProductSupplyChainState as represented in the enum above
    ProductSupplyChainState public itemProductSupplyChainState;


constructor(
        uint256 _upc)//,
        //uint256 _sku,)
        public
{
    upc=_upc;
    //sku=_sku;
        // Setting state tp Prposed for crowdfunding
        itemProductSupplyChainState = defaultProductSupplyChainState;
}

    event Harvested(uint256 upc);
    event Processed(uint256 upc);
    event Packed(uint256 upc);
    event ForSale(uint256 upc);
    event Sold(uint256 upc);
    event Shipped(uint256 upc);
    event Received(uint256 upc);
    event Purchased(uint256 upc);

    function updateProductStatus(
        ProductSupplyChainState newProductSupplyChainState
    ) public returns (bool) {
        require(
            itemProductSupplyChainState != newProductSupplyChainState,
            "Product already in required supply chain state"
        );
        itemProductSupplyChainState = newProductSupplyChainState;
        return true;
    }
}
