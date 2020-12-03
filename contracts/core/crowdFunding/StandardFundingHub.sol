// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./CrowdFundedProduct.sol";
import "./CommonUtility.sol";
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
        string memory _originFarmName,
        string memory _productAddrNotes,
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
        // bytes32 productAddrHash = keccak256(
        //     abi.encode(msg.sender, _fundingCap, block.timestamp + _deadline)
        // );

        productAddrContract = new CrowdFundedProduct(
            _upc,
            _sku,
            _ownerID,
            _originFarmName,
            _productAddrNotes,
            _fundingCap,
            _deadline
        );
        addProduct(productAddrContract, _upc);
        _upc = _upc + 1;
        //emit LogStandardProductCreation(msg.sender, productAddrContract);
    }

    function contribute(address productAddr, uint256 amount)
        public
    //override
    //atStatus(ProductFundingStatus.Active)
    {
        require(address(productAddr) != address(0) && amount > 0, "Address or Amount check failed");
        CrowdFundedProduct(productAddr).fund(amount, msg.sender);
        //emit LogProductContribution(address(_productAddr), msg.sender, _amount);
    }

    function addProduct(CrowdFundedProduct productAddrContract, uint256 upc)
        internal
    {
        productAddrs[upc] = address(productAddrContract);
    }

    function getProductAddresses() public view returns (address[] memory) {
        address[] memory ret = new address[](_upc);
        for (uint256 i = 0; i+1 < _upc; i++) {
            ret[i] = productAddrs[i+1];
        }
        return ret;
    }

}
