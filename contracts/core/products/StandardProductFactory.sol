// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './StandardProduct.sol';

contract StandardProductFactory{
address[] products;
//    function createChildContract(address _creator,
//         uint256 _fundingCap,
//         uint256 _deadline) public payable {
//       // insert check if the sent ether is enough to cover the car asset ...
//       StandardProduct newProduct = new StandardProduct(_creator, _fundingCap, _deadline);            
//       products.push(address(newProduct));   
//    }

   function getDeployedChildContracts() public view returns (address[] memory) {
      return products;
   }
}
