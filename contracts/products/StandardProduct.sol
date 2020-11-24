// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;


import '../products/Product.sol'; 
import '../utils/Math.sol';

contract StandardProduct is Product {
        
    constructor(address _creator, uint _fundingCap, uint _deadline)
    public
        Product(_creator, _fundingCap, _deadline)
    {

    }

modifier evalExpiry {
        if (block.timestamp > creationTime + deadline && 
            status != ProductFundingStatus.Closed) {
            status = ProductFundingStatus.Expired;     
        }        
        _;
    } 

    modifier evalFundingStage {
        if (status != ProductFundingStatus.Closed) {
            if ((stage != FundingStage.CapReached || 
                stage != FundingStage.EarlySuccess) && 
                status == ProductFundingStatus.Expired) {
                    stage = FundingStage.Failed;
            } else if (stage == FundingStage.CapReached && 
                       status == ProductFundingStatus.Active) {
                    stage = FundingStage.EarlySuccess;
            } else if (stage == FundingStage.CapReached && 
                       status == ProductFundingStatus.Expired) {
                    stage = FundingStage.Success;
            }
        }
        _;
    }    


    function fund(uint _funding, address investor) override
        evalExpiry
        evalFundingStage
        public
    {
        require(stage == FundingStage.Open || 
                stage == FundingStage.FundingRaised);

        // Reduce contribution amount if it exceeds funding cap, or overflows
        if (amountRaised() + _funding > fundingCap || 
            amountRaised() + _funding < amountRaised()) {
            _funding = fundingCap - amountRaised();
        }
 
        require(fundingToken.contribute(_funding, investor) && 
                fundingToken.transferFrom(investor, address(this), _funding));

        LogProductContributed(investor, _funding);

        if (amountRaised() == fundingCap) {
            stage = FundingStage.CapReached;             
            LogFundingCapReached(block.timestamp, _funding);            
        } else {
            stage = FundingStage.FundingRaised; 
        }
    }    

    function refund() override
        evalExpiry
        evalFundingStage
        public 
    {
        require(stage == FundingStage.Failed);
        uint toRefund = fundingToken.contributionOf(msg.sender);
        require(fundingToken.transfer(msg.sender, toRefund));       
        LogRefund(msg.sender, address(this), toRefund); 
    }

    function payout() override
        evalExpiry
        evalFundingStage
        public
    {
        require(stage == FundingStage.Success || 
                stage == FundingStage.EarlySuccess);
        
        uint payOut = fundingToken.balanceOf(address(this));
        require(fundingToken.transfer(beneficiary, payOut));
        stage = FundingStage.PaidOut;
        status = ProductFundingStatus.Closed;
        LogPayout(beneficiary, payOut);
    }


    
    function projectStatus()
        public 
        view 
        returns (ProductFundingStatus)
    {
        return status;
    }

    function fundingStage()
        public 
        view 
        returns (FundingStage)
    {
        return stage;
    }    
          
}