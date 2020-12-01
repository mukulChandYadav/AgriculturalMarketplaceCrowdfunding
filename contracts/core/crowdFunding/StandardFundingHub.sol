// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./CrowdFundedProduct.sol";
import "./CommonUtility.sol";
import "../base/Ownable.sol";

contract StandardFundingHub is Ownable{
    mapping(uint256 => address) public products;
    mapping(bytes32 => bytes32) public productList;

    // constructor(
    //     uint256 _upc,
    //     //uint256 _sku,
    //     address payable _ownerID,
    //     address payable _originFarmerID,
    //     string memory _originFarmName,
    //     string memory _originFarmInformation,
    //     string memory _originFarmLatitude,
    //     string memory _originFarmLongitude,
    //     string memory _productNotes,
    //     uint256 _fundingCap,
    //     uint256 _deadline
    // )
    //     public
    //     CrowdFundedProduct(
    //         _upc,
    //         //uint256 _sku,
    //         _ownerID,
    //         _originFarmerID,
    //         _originFarmName,
    //         _originFarmInformation,
    //         _originFarmLatitude,
    //         _originFarmLongitude,
    //         _productNotes,
    //         _fundingCap,
    //         _deadline
    //     )
    // {}

    // modifier atStatus(ProductFundingStatus _expectedStatus) {
    //     require(CrowdFundedProduct(msg.sender).status() == _expectedStatus);
    //     _;
    // }

    function createProduct(
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
        returns (
            // override
            // atStatus(ProductFundingStatus.Active)
            CrowdFundedProduct productContract
        )
    {
        // bytes32 productHash = keccak256(
        //     abi.encode(msg.sender, _fundingCap, block.timestamp + _deadline)
        // );

        // ensure that project does not already exist.
        require(address(products[_upc]) == address(0));
        productContract = new CrowdFundedProduct(
            _upc,
            //_sku,
            _ownerID,
            _originFarmerID,
            _originFarmName,
            _originFarmInformation,
            _originFarmLatitude,
            _originFarmLongitude,
            _productNotes,
            _fundingCap,
            _deadline
        );
        addProduct(productContract, _upc);
        //emit LogStandardProductCreation(msg.sender, productContract);
    }

    function contribute(CrowdFundedProduct _product, uint256 _amount)
        public
    //override
    //atStatus(ProductFundingStatus.Active)
    {
        require(address(_product) != address(0) && _amount > 0);
        CrowdFundedProduct(_product).fund(_amount, msg.sender);
        //emit LogProductContribution(address(_product), msg.sender, _amount);
    }

    function addProduct(CrowdFundedProduct _productContract, uint256 _upc)
        internal
    {
        products[_upc] = address(_productContract);
        //productList[_productHash] = productList[0x0];
        //productList[0x0] = _productHash;
    }
}
