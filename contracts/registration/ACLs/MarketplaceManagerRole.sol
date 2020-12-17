// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'MarketplaceManagerRole' to manage this role - add, remove, check
contract MarketplaceManagerRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event MarketplaceManagerAdded(address indexed account);
  event MarketplaceManagerRemoved(address indexed account);
  // Define a struct 'marketplaceManagers' by inheriting from 'Roles' library, struct Role
  Roles.Role private marketplaceManagers;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public{
    //_addMarketplaceManager(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyMarketplaceManager() {
    require(marketplaceManagers.has(msg.sender), "This account has no Consumer Role");
    _;
  }

  // Define a function 'isMarketplaceManager' to check this role
  function isMarketplaceManager(address account) public view returns (bool) {
    return marketplaceManagers.has(account);
  }

  // Define a function 'addMarketplaceManager' that adds this role
  function addMarketplaceManager(address account) public {
    _addMarketplaceManager(account);
  }

  // Define a function 'renounceMarketplaceManager' to renounce this role
  function renounceMarketplaceManager() public {
    _removeMarketplaceManager(msg.sender);
  }

  // Define an internal function '_addMarketplaceManager' to add this role, called by 'addConsumer'
  function _addMarketplaceManager(address account) internal {
    marketplaceManagers.add(account);
    emit MarketplaceManagerAdded(account);
  }

  // Define an internal function '_removeMarketplaceManager' to remove this role, called by 'removeMarketplaceManager'
  function _removeMarketplaceManager(address account) internal {
    marketplaceManagers.remove(account);
    emit MarketplaceManagerRemoved(account);
  }
}
