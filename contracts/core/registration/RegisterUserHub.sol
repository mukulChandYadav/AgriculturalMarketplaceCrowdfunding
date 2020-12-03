// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './ACLs/FarmerRole.sol';
import './ACLs/DonorRole.sol';
import './ACLs/ConsumerRole.sol';
import './ACLs/ForwardMarketConsumerRole.sol';
import './ACLs/SpotMarketConsumerRole.sol';
import './ACLs/InvestorRole.sol';

// TODO: Implement better design pattern to encapsulate all user roles
abstract contract RegisterUserHub is
    FarmerRole,
    DonorRole,
    ConsumerRole,
    ForwardMarketConsumerRole,
    SpotMarketConsumerRole,
    InvestorRole
{

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


    //Add account to common registry
    function registerUser(uint256 userRoleType) public virtual returns(bool);

    //Check if account has registered
    function isRegistered() public virtual view returns (bool);

    
    //Check if account has registered
    function getUserRole() public virtual view returns (UserRoleType);

}
