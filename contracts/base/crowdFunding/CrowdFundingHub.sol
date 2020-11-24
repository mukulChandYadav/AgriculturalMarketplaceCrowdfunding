// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import '../../products/StandardProduct.sol'; 

abstract contract CrowdFundingHub {

    event LogStandardProductCreation(address indexed productCreator, StandardProduct indexed standardProduct);
    event LogProductContribution(address indexed productContract, address contributor, uint contribution);    

    enum FundingStatus {
        Active,
        Inactive
    }

    address public creator;
    uint public createdAtBlock;
    FundingStatus public status;

    function createProduct(uint _fundingCap, uint _deadline) public virtual returns(StandardProduct);
    function contribute(Product _project, uint _contribution) public virtual;
}