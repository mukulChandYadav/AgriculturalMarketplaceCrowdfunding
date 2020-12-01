// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "../tokens/FundingToken.sol";
import "../crowdFunding/CrowdFundedProduct.sol";
import "../base/Ownable.sol";
import "../../utils/Tools.sol";

contract SupplychainProduct is Ownable {
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

    function getProductSupplyChainStateStr(ProductSupplyChainState scs)
        internal
        pure
        returns (string memory)
    {
        if (scs == ProductSupplyChainState.ProductErrorState)
            return "ProductErrorState";
        if (scs == ProductSupplyChainState.ProposalPublished)
            return "ProposalPublished";
        if (scs == ProductSupplyChainState.RequiredFundingAchieved)
            return "RequiredFundingAchieved";
        if (scs == ProductSupplyChainState.Harvested) return "Harvested";
        if (scs == ProductSupplyChainState.ForSale) return "ForSale";
        if (scs == ProductSupplyChainState.Sold) return "Sold";
        if (scs == ProductSupplyChainState.Purchased) return "Purchased";
        return "UnknownSupplychainStage";
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
        uint256 _upc //,
    ) public //uint256 _sku,)
    {
        upc = _upc;
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

    // Define a modifier that checks if an supplychain state of a product is same as requested one
    modifier atSupplyChainState(ProductSupplyChainState supplychainState) {
        require(
            itemProductSupplyChainState == supplychainState,
            Tools.append(
                "The Product is not in required ",
                getProductSupplyChainStateStr(supplychainState),
                " state!",
                "",
                ""
            )
        );
        _;
    }

    // // Define a modifier that checks if an item.state of a upc is Processed
    // modifier processed(uint256 _upc) {
    //     StandardProduct product = StandardProduct(products[_upc]);
    //     require(
    //         product.itemProductSupplyChainState() ==
    //             ProductSupplyChainState.Processed,
    //         "The Product is not in Processed state!"
    //     );
    //     _;
    // }

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

    // Define a function 'harvestProduct' that allows a farmer to mark an item 'Harvested'
    function harvestProduct()
        public
        virtual
        onlyOwner
        atSupplyChainState(ProductSupplyChainState.RequiredFundingAchieved)
        returns (bool)
    {
        require(updateProductStatus(ProductSupplyChainState.Harvested));
        emit Harvested(upc);
        return true;
    }
}
