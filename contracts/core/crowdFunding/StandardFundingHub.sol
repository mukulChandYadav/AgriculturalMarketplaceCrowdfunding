// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./CrowdFundedProduct.sol";
//import "./CommonUtility.sol";
import "../base/Ownable.sol";

contract StandardFundingHub is Ownable {
    mapping(uint256 => address) public productAddrs;
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
        uint256 _productPrice,
        //string memory _originFarmName,
        //string memory _productNotes,
        uint256 _fundingCap,
        uint256 _deadline
    )
        public
        returns (
            // override
            // atStatus(ProductFundingStatus.Active)
            CrowdFundedProduct productAddrContract
        )
    {

        productAddrContract = new CrowdFundedProduct(
            _upc,
            _sku,
            _ownerID,
            _productPrice,
            //_originFarmName,
            //_productNotes,
            _fundingCap,
            _deadline
        );
        addProduct(productAddrContract, _upc);
        _upc = _upc + 1;
        //emit LogStandardProductCreation(msg.sender, productAddrContract);
    }

    function contribute(CrowdFundedProduct product, uint256 amount)//address productAddr, uint256 amount)
        external
    //override
    //atStatus(ProductFundingStatus.Active)
    {
        require(address(product) != address(0) && amount > 0, "Address or Amount check failed");
        //CrowdFundedProduct CFProduct = CrowdFundedProduct(productAddr);
        //uint256 amountRaised = product.amountRaised();//CFProduct.amountRaised();
        product.fund(amount, msg.sender);
        //emit LogProductContribution(address(_productAddr), msg.sender, _amount);
    }

    function addProduct(CrowdFundedProduct productAddrContract, uint256 upc)
        internal
    {
        productAddrs[upc] = address(productAddrContract);
    }

    function getProductAddresses() external view returns (address[] memory) {
        address[] memory ret = new address[](_upc);
        for (uint256 i = 0; i+1 < _upc; i++) {
            ret[i] = productAddrs[i+1];
        }
        return ret;
    }

}
