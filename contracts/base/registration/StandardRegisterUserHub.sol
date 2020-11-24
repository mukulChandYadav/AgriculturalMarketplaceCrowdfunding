// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './RegisterUserHub.sol';

import '../../ACLs/FarmerRole.sol';
import '../../ACLs/DonorRole.sol';
import '../../ACLs/ForwardMarketConsumerRole.sol';
import '../../ACLs/SpotMarketConsumerRole.sol';
import '../../ACLs/InvestorRole.sol';
contract StandardRegisterUserHub is RegisterUserHub{


    modifier notRegistered()  {
        require(registeredUsers[msg.sender] == UserRoleType.DefaultPlaceholder);
        _;
    }

    modifier notSignedUp()  {
        require(signedUpUsers[msg.sender] == false);
        _;
    }

    

    //Sign up user accounts
    function signUpUser() override public notSignedUp {
        signedUpUsers[msg.sender] = true;
    }


    //Add account to common registry
    function registerUser(uint256 userRoleType) override public notRegistered {
        if (userRoleType == 1) {
            registeredUsers[msg.sender] = UserRoleType.Farmer;
        } else {
            if (userRoleType == 2) {
                registeredUsers[msg.sender] = UserRoleType.Donor;
            } else {
                if (userRoleType == 3) {
                    registeredUsers[msg.sender] = UserRoleType.Investor;
                } else {
                    if (userRoleType == 4) {
                        registeredUsers[msg.sender] = UserRoleType
                            .ForwardMarketConsumer;
                    } else {
                        registeredUsers[msg.sender] = UserRoleType
                            .SportMarketConsumer;
                    }
                }
            }
        }
    }


    //Check if account has registered
    function isRegistered() override public view returns (bool) {
        return registeredUsers[msg.sender] != UserRoleType.DefaultPlaceholder;
    }



}

