// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;



abstract contract  RegisterUserHub{

    
    // Signed up users
    mapping(address => bool) signedUpUsers;

    //Registered users to role mapping
    mapping(address => UserRoleType) registeredUsers;

    enum UserRoleType {
        DefaultPlaceholder,
        Farmer,
        Donor,
        Investor,
        ForwardMarketConsumer,
        SportMarketConsumer
    }

    //Sign up user accounts
    function signUpUser() public virtual;

    //Add account to common registry
    function registerUser(uint256 userRoleType) public virtual;


    //Check if account has registered
    function isRegistered() public view virtual returns (bool) ;



}