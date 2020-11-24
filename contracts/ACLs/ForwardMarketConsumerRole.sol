// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

// Import the library 'Roles'
import './Roles.sol';
//import './ConsumerRole.sol';

// Define a contract 'ForwardMarketConsumerRole' to manage this role - add, remove, check
contract ForwardMarketConsumerRole {// /*is ConsumerRole*/

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event ForwardMarketConsumerAdded(address indexed account);
  event ForwardMarketConsumerRemoved(address indexed account);
  // Define a struct 'forwardMarketConsumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private forwardMarketConsumers;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public{
    //_addForwardMarketConsumer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
   modifier onlyForwardMarketConsumer(){//modifier onlyConsumer() /*override*/{
    require(forwardMarketConsumers.has(msg.sender), "This account has no Consumer Role");
    _;
  }

  // Define a function 'isForwardMarketConsumer' to check this role
  function isForwardMarketConsumer(address account) public view returns (bool)  {//function isConsumer(address account) /*override*/ public view returns (bool)  {
    return forwardMarketConsumers.has(account);
  }

  // Define a function 'addForwardMarketConsumer' that adds this role
  function addForwardMarketConsumer(address account) public {//function addConsumer(address account) /*override*/ public {
    _addForwardMarketConsumer(account);
  }

  // Define a function 'renounceForwardMarketConsumer' to renounce this role
  function renounceForwardMarketConsumer() public {//function renounceConsumer() /*override*/ public {
    _removeForwardMarketConsumer(msg.sender);
  }

  // Define an internal function '_addForwardMarketConsumer' to add this role, called by 'addForwardMarketConsumer'
  function _addForwardMarketConsumer(address account) internal {
    forwardMarketConsumers.add(account);
    emit ForwardMarketConsumerAdded(account);
  }

  // Define an internal function '_removeForwardMarketConsumer' to remove this role, called by 'removeForwardMarketConsumer'
  function _removeForwardMarketConsumer(address account) internal {
    forwardMarketConsumers.remove(account);
    emit ForwardMarketConsumerRemoved(account);
  }
}
