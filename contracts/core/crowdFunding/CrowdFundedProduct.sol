// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "../tokens/FundingToken.sol";
import "../products/StandardProduct.sol";

//interface CrowdFundedProduct {
contract CrowdFundedProduct is StandardProduct {
    enum ProductFundingStatus {Active, Inactive, Expired, Closed}

    enum FundingStage {
        Open,
        FundingRaised,
        CapReached,
        EarlySuccess,
        Success,
        PaidOut,
        Failed
    }

    enum FundingStatus {Active, Inactive, Closed}

    //address public creator;
    //uint256 public createdAtBlock;
    uint256 public creationTime;
    uint256 public deadline;
    uint256 public fundingCap;
    address public beneficiary;
    ProductFundingStatus public status;
    FundingStage public stage;
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

    // function createProduct(uint256 _fundingCap, uint256 _deadline)
    //     public
    //     virtual
    //     returns (StandardProduct);

    // function contribute(StandardProduct _product, uint256 _contribution)
    //     public
    //     virtual;

    constructor(
        uint256 _upc,
        //uint256 _sku,
        address payable _ownerID,
        address payable _originFarmerID,
        string memory _originFarmName,
        string memory _originFarmInformation,
        string memory _originFarmLatitude,
        string memory _originFarmLongitude,
        string memory _productNotes,
        uint256 _fundingCap,
        uint256 _deadline
    )
        public
        StandardProduct(
            _upc,
            //uint256 _sku,
            _ownerID,
            _originFarmerID,
            _originFarmName,
            _originFarmInformation,
            _originFarmLatitude,
            _originFarmLongitude,
            _productNotes
        )
    {
        beneficiary = _ownerID;
        fundingCap = _fundingCap;
        creationTime = block.timestamp;
        deadline = _deadline;
        fundingToken = new FundingToken();
        stage = FundingStage.Open;
        status = ProductFundingStatus.Active;
    }

    function projectStatus() public view returns (ProductFundingStatus) {
        return status;
    }

    function fundingStage() public view returns (FundingStage) {
        return stage;
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
                (stage != FundingStage.CapReached ||
                    stage != FundingStage.EarlySuccess) &&
                status == ProductFundingStatus.Expired
            ) {
                stage = FundingStage.Failed;
            } else if (
                stage == FundingStage.CapReached &&
                status == ProductFundingStatus.Active
            ) {
                stage = FundingStage.EarlySuccess;
            } else if (
                stage == FundingStage.CapReached &&
                status == ProductFundingStatus.Expired
            ) {
                stage = FundingStage.Success;
            }
        }
        _;
    }

    function amountRaised() public view returns (uint256 amount) {
        amount = fundingToken.balanceOf(address(this));
    }

    function fund(uint256 _funding, address investor)
        public
        evalExpiry
        evalFundingStage
    {
        require(
            stage == FundingStage.Open || stage == FundingStage.FundingRaised
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
            stage = FundingStage.CapReached;
            emit LogFundingCapReached(block.timestamp, _funding);
        } else {
            stage = FundingStage.FundingRaised;
        }
    }

    function refund()
        public
        //override
        evalExpiry
        evalFundingStage
    {
        require(stage == FundingStage.Failed);
        uint256 toRefund = fundingToken.contributionOf(msg.sender);
        require(fundingToken.transfer(msg.sender, toRefund));
        require(updateProductStatus(ProductSupplyChainState.ProductErrorState));

        emit LogRefund(msg.sender, address(this), toRefund);
    }

    function payout()
        public
        //override
        evalExpiry
        evalFundingStage
    {
        require(
            stage == FundingStage.Success || stage == FundingStage.EarlySuccess
        );

        uint256 payOut = fundingToken.balanceOf(address(this));
        require(fundingToken.transfer(beneficiary, payOut));
        stage = FundingStage.PaidOut;
        status = ProductFundingStatus.Closed;
        require(
            updateProductStatus(ProductSupplyChainState.RequiredFundingAchieved)
        );
        emit LogPayout(beneficiary, payOut);
    }
}
