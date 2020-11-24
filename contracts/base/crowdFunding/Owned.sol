// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier fromOwner {
        require(msg.sender == owner);
        _;
    }

    function setOwner(address newOwner) public fromOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }
}