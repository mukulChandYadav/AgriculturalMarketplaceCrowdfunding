// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './CrowdFundingHub.sol'; 
import './Owned.sol';

contract StandardCrowdFundingHub is CrowdFundingHub, Owned {

    mapping (bytes32 => Product) public products;
    mapping (bytes32 => bytes32) public productList;

    modifier atStatus(FundingStatus _expectedStatus) {
        require(status == _expectedStatus);
        _;
    }

    constructor ()
        public        
    {
        owner = msg.sender;
        status = FundingStatus.Active; 
    }



    function createProduct(
        uint _fundingCap, 
        uint _deadline) override
        atStatus(FundingStatus.Active)
        public
        returns (StandardProduct productContract)
    {
        bytes32 productHash = keccak256(abi.encode(msg.sender, _fundingCap, block.timestamp + _deadline));
        // ensure that project does not already exist.
        require(address(products[productHash]) == address(0));
        productContract = new StandardProduct(msg.sender, _fundingCap, _deadline);        
        addProduct(productContract, productHash);
        LogStandardProductCreation(msg.sender, productContract);
    }

    function contribute(Product _product, uint _amount) override
        atStatus(FundingStatus.Active)
        public
    {   
        require(address(_product) != address(0) && _amount > 0);
        //TODO: Priority #1
        //StandardProduct(_product.beneficiary, _product.fundingCap, _product.deadline).fund(_amount, msg.sender);
        LogProductContribution(address(_product), msg.sender, _amount);    
    }

    function addProduct(StandardProduct _productContract, bytes32 _productHash)
        internal 
    {
        products[_productHash] = _productContract;
        productList[_productHash] = productList[0x0]; 
        productList[0x0] = _productHash;
    }    

    function toggleActive() 
        fromOwner 
        public 
    {
        status = (status == FundingStatus.Active) ? FundingStatus.Inactive : FundingStatus.Active;
    }        
}
