// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./CrowdFundedProduct.sol";
import "./CommonUtility.sol";
import "../base/Ownable.sol";

contract StandardFundingHub is Ownable {
    mapping(uint256 => address) public products;
    mapping(uint256 => uint256) public upcList;
    uint256 _upc;

    constructor() public {
        _upc = 1;
    }

    // modifier atStatus(ProductFundingStatus _expectedStatus) {
    //     require(CrowdFundedProduct(msg.sender).status() == _expectedStatus);
    //     _;
    // }

    function createProduct(
        uint256 _sku,
        address payable _ownerID,
        string memory _originFarmName,
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

        productContract = new CrowdFundedProduct(
            _upc,
            _sku,
            _ownerID,
            _originFarmName,
            _productNotes,
            _fundingCap,
            _deadline
        );
        addProduct(productContract, _upc);
        _upc = _upc + 1;
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

    function addProduct(CrowdFundedProduct productContract, uint256 upc)
        internal
    {
        products[upc] = address(productContract);
    }

    function getProductAddresses() public view returns (address[] memory) {
        address[] memory ret = new address[](_upc);
        for (uint256 i = 0; i+1 < _upc; i++) {
            ret[i] = products[i+1];
        }
        return ret;
    }

}
