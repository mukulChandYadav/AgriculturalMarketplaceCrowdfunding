// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "../tokens/FundingToken.sol";
import "../products/StandardProduct.sol";
//import "./CommonUtility.sol";

contract CrowdFundedProduct is StandardProduct {
    enum ProductFundingStatus {Active, Inactive, Expired, Closed}

    //enum FundingStatus {Active, Inactive, Closed}

    enum FundingStage {
        Open, //0
        FundingRaised, //1
        CapReached, //2
        EarlySuccess, //3
        Success, //4
        PaidOut, //5
        Failed //6
    }

    //address public creator;
    //uint256 public createdAtBlock;
    uint256 public creationTime;
    uint256 public deadline;
    uint256 public fundingCap;
    address public beneficiary;
    ProductFundingStatus public status; //TODO: Remove
    FundingStage public fundingStage;
    FundingToken public fundingToken;

    event LogProductContribution(
        address indexed productContract,
        address contributor,
        uint256 contribution
    );

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

    // Define 10 events with the same 10 state values and accept 'upc' as input argument
    event ProposalPublished(uint256 upc);
    event RequiredFundingAchieved(uint256 upc);

    constructor(
        uint256 _upc,
        uint256 _sku,
        address payable _ownerID,
        uint256 _productPrice,
        //string memory _originFarmName,
        //string memory _productNotes,
        uint256 _fundingCap,
        uint256 _deadline
    )
        public
        StandardProduct(
            _upc,
            _sku,
            _ownerID,
            _productPrice
            //,_originFarmName,
            //_productNotes
        )
    {
        beneficiary = _ownerID;
        fundingCap = _fundingCap;
        creationTime = block.timestamp;
        deadline = _deadline;
        fundingToken = new FundingToken();
        fundingStage = FundingStage.Open;
        status = ProductFundingStatus.Active;
    }

    function productStatus() public view returns (ProductFundingStatus) {
        return status;
    }

    modifier atFundingStage(FundingStage requiredFundingStage) {
        require(
            fundingStage == requiredFundingStage,
            "Product not at required funding fundingStage"
        );
        _;
    }

    modifier evalExpiry {
        if (
            block.timestamp > creationTime + deadline &&
            status != ProductFundingStatus.Closed
        ) {
            status = ProductFundingStatus.Expired;
        }
        _;
    }

    modifier evalFundingStage {
        if (status != ProductFundingStatus.Closed) {
            if (
                (fundingStage != FundingStage.CapReached ||
                    fundingStage != FundingStage.EarlySuccess) &&
                status == ProductFundingStatus.Expired
            ) {
                fundingStage = FundingStage.Failed;
            } else if (
                fundingStage == FundingStage.CapReached &&
                status == ProductFundingStatus.Active
            ) {
                fundingStage = FundingStage.EarlySuccess;
            } else if (
                fundingStage == FundingStage.CapReached &&
                status == ProductFundingStatus.Expired
            ) {
                fundingStage = FundingStage.Success;
            }
        }
        _;
    }

    function amountRaised() public view returns (uint256 amount) {
        amount = fundingToken.balanceOf(address(this));
        return amount;
    }

    function fund(uint256 _funding, address investor)
        public
        evalExpiry
        evalFundingStage
        returns (bool)
    {
        require(
            fundingStage == FundingStage.Open ||
                fundingStage == FundingStage.FundingRaised
        );

        // Reduce contribution amount if it exceeds funding cap, or overflows
        if (
            amountRaised() + _funding > fundingCap ||
            amountRaised() + _funding < amountRaised()
        ) {
            _funding = fundingCap - amountRaised();
        }

        require(
            fundingToken.contribute(_funding, investor) &&
                fundingToken.transferFrom(investor, address(this), _funding)
        );

        emit LogProductContributed(investor, _funding);

        if (amountRaised() == fundingCap) {
            fundingStage = FundingStage.CapReached;
            emit LogFundingCapReached(block.timestamp, _funding);
        } else {
            fundingStage = FundingStage.FundingRaised;
        }
        return true;
    }

    function refund()
        public
        //override
        evalExpiry
        evalFundingStage
        returns (bool)
    {
        require(fundingStage == FundingStage.Failed);
        uint256 toRefund = fundingToken.contributionOf(msg.sender);
        require(fundingToken.transfer(msg.sender, toRefund));
        require(updateProductStatus(ProductSupplyChainState.ProductErrorState));

        emit LogRefund(msg.sender, address(this), toRefund);
        return true;
    }

    function payout()
        public
        //override
        evalExpiry
        evalFundingStage
        returns (bool)
    {
        require(
            fundingStage == FundingStage.Success ||
                fundingStage == FundingStage.EarlySuccess
        );

        uint256 payOut = fundingToken.balanceOf(address(this));
        require(fundingToken.transfer(beneficiary, payOut));
        fundingStage = FundingStage.PaidOut;
        status = ProductFundingStatus.Closed;
        require(
            updateProductStatus(ProductSupplyChainState.RequiredFundingAchieved)
        );
        emit LogPayout(beneficiary, payOut);
        return true;
    }

    function toggleActive() public onlyOwner {
        status = (status == ProductFundingStatus.Active)
            ? ProductFundingStatus.Inactive
            : ProductFundingStatus.Active;
    }

    // Define a function 'harvestProduct' that allows a farmer to mark an item 'Harvested'
    function harvestProduct()
        public
        override
        atFundingStage(FundingStage.PaidOut)
        returns (bool)
    {
        require(super.harvestProduct());
        return true;
    }

    // Define a function 'sellProduct' that allows a farmer to mark an item 'ForSale'
    function sellProduct(uint256 _price)
        public
        atFundingStage(FundingStage.PaidOut)
    {
        // Update the appropriate fields
        // StandardProduct existingProduct = StandardProduct(products[_upc]);
        // existingProduct.updateProductStatus(ProductSupplyChainState.ForSale);
        //existingProduct.productPrice = _price;
        // Emit the appropriate event
        // emit ForSale(_upc);
    }

    // function createProduct(uint256 _fundingCap, uint256 _deadline)
    //     public
    //     virtual
    //     returns (StandardProduct);

    // function contribute(StandardProduct _product, uint256 _contribution)
    //     public
    //     virtual;
}
