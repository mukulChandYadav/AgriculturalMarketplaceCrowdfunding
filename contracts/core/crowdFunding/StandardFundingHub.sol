// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './CrowdFundedProduct.sol';


contract StandardFundingHub is 
CrowdFundedProduct {
    //mapping(bytes32 => address) public products;
    //mapping(bytes32 => bytes32) public productList;

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
    ) public
    CrowdFundedProduct( _upc,
        //uint256 _sku,
        _ownerID,
        _originFarmerID,
         _originFarmName,
         _originFarmInformation,
         _originFarmLatitude,
         _originFarmLongitude,
         _productNotes,
         _fundingCap,
         _deadline){}




    modifier atStatus(ProductFundingStatus _expectedStatus) {
        require(status == _expectedStatus);
        _;
    }


    // function createProduct(uint256 _fundingCap, uint256 _deadline)
    //     public
    //     override
    //     atStatus(ProductFundingStatus.Active)
    //     returns (StandardProduct productContract)
    // {
    //     bytes32 productHash = keccak256(
    //         abi.encode(msg.sender, _fundingCap, block.timestamp + _deadline)
    //     );
    //     // ensure that project does not already exist.
    //     require(address(products[productHash]) == address(0));
    //     productContract = StandardProduct(address(0));
    //     //TODO: new StandardProduct(msg.sender, _fundingCap, _deadline);
    //     addProduct(productContract, productHash);
    //     emit LogStandardProductCreation(msg.sender, productContract);
    // }

    function contribute(StandardProduct _product, uint256 _amount)
        public
        //override
        atStatus(ProductFundingStatus.Active)
    {
        require(address(_product) != address(0) && _amount > 0);
        //TODO: Priority #1
        //StandardProduct(_product.beneficiary, _product.fundingCap, _product.deadline).fund(_amount, msg.sender);
        emit LogProductContribution(address(_product), msg.sender, _amount);
    }

    // function addProduct(StandardProduct _productContract, bytes32 _productHash)
    //     internal
    // {
    //     products[_productHash] = address(_productContract);
    //     productList[_productHash] = productList[0x0];
    //     productList[0x0] = _productHash;
    // }

    function toggleActive() public onlyOwner {
        status = (status == ProductFundingStatus.Active)
            ? ProductFundingStatus.Inactive
            : ProductFundingStatus.Active;
    }
}
