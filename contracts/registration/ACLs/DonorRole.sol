// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DonorRole' to manage this role - add, remove, check
contract DonorRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event DonorAdded(address indexed account);
  event DonorRemoved(address indexed account);
  // Define a struct 'donors' by inheriting from 'Roles' library, struct Role
  Roles.Role private donors;

  // In the constructor make the address that deploys this contract the 1st donor
  constructor() public {
    //_addDonor(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDonor() {
    require(donors.has(msg.sender), "This account has no Consumer Role");
    _;
  }

  // Define a function 'isDonor' to check this role
  function isDonor(address account) public view returns (bool) {
    return donors.has(account);
  }

  // Define a function 'addDonor' that adds this role
  function addDonor(address account) public {
    _addDonor(account);
  }

  // Define a function 'renounceDonor' to renounce this role
  function renounceDonor() public {
    _removeDonor(msg.sender);
  }

  // Define an internal function '_addDonor' to add this role, called by 'addDonor'
  function _addDonor(address account) internal {
    donors.add(account);
    emit DonorAdded(account);
  }

  // Define an internal function '_removeDonor' to remove this role, called by 'removeDonor'
  function _removeDonor(address account) internal {
    donors.remove(account);
    emit DonorRemoved(account);
  }
}
