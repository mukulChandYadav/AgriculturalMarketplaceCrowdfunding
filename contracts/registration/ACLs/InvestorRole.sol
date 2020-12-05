// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'InvestorRole' to manage this role - add, remove, check
contract InvestorRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event InvestorAdded(address indexed account);
  event InvestorRemoved(address indexed account);
  // Define a struct 'investors' by inheriting from 'Roles' library, struct Role
  Roles.Role private investors;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public{
    //_addInvestor(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyInvestor() {
    require(investors.has(msg.sender), "This account has no Consumer Role");
    _;
  }

  // Define a function 'isInvestor' to check this role
  function isInvestor(address account) public view returns (bool) {
    return investors.has(account);
  }

  // Define a function 'addInvestor' that adds this role
  function addInvestor(address account) public {
    _addInvestor(account);
  }

  // Define a function 'renounceInvestor' to renounce this role
  function renounceInvestor() public {
    _removeInvestor(msg.sender);
  }

  // Define an internal function '_addInvestor' to add this role, called by 'addConsumer'
  function _addInvestor(address account) internal {
    investors.add(account);
    emit InvestorAdded(account);
  }

  // Define an internal function '_removeInvestor' to remove this role, called by 'removeInvestor'
  function _removeInvestor(address account) internal {
    investors.remove(account);
    emit InvestorRemoved(account);
  }
}
