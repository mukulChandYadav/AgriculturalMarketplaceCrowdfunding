// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// Import the library 'Roles'
import './Roles.sol';
//import './ConsumerRole.sol';

// Define a contract 'SpotMarketConsumerRole' to manage this role - add, remove, check
contract SpotMarketConsumerRole {// /*is ConsumerRole*/

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event SpotMarketConsumerAdded(address indexed account);
  event SpotMarketConsumerRemoved(address indexed account);
  // Define a struct 'spotMarketConsumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private spotMarketConsumers;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    //_addSpotMarketConsumer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlySpotMarketConsumer(){//modifier onlyConsumer() /*override*/ {
    require(spotMarketConsumers.has(msg.sender), "This account has no Consumer Role");
    _;
  }

  // Define a function 'isSpotMarketConsumer' to check this role
  function isSpotMarketConsumer(address account) public view returns (bool) {
//function isConsumer(address account) /*override*/ public view returns (bool) {
    return spotMarketConsumers.has(account);
  }

  // Define a function 'addSpotMarketConsumer' that adds this role
  function addSpotMarketConsumer(address account) public {//function addConsumer(address account) /*override*/ public {
    _addSpotMarketConsumer(account);
  }

  // Define a function 'renounceSpotMarketConsumer' to renounce this role
  function renounceSpotMarketConsumer() public {//function renounceConsumer() /*override*/ public {
    _removeSpotMarketConsumer(msg.sender);
  }

  // Define an internal function '_addSpotMarketConsumer' to add this role, called by 'addSpotMarketConsumer'
  function _addSpotMarketConsumer(address account) internal {
    spotMarketConsumers.add(account);
    emit SpotMarketConsumerAdded(account);
  }

  // Define an internal function '_removeSpotMarketConsumer' to remove this role, called by 'removeSpotMarketConsumer'
  function _removeSpotMarketConsumer(address account) internal {
    spotMarketConsumers.remove(account);
    emit SpotMarketConsumerRemoved(account);
  }
}
