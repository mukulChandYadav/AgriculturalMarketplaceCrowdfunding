// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./RegisterUserHub.sol";

contract StandardRegisterUserHub is RegisterUserHub {
    modifier notRegistered() {
        require(registeredUsers[msg.sender] == UserRoleType.DefaultPlaceholder);
        _;
    }

    modifier notSignedUp() {
        require(signedUpUsers[msg.sender] == false);
        _;
    }

    modifier hasSignedUp() {
        require(signedUpUsers[msg.sender] == true);
        _;
    }

    //Sign up user accounts
    function signUpUser() public override notSignedUp returns (bool) {
        signedUpUsers[msg.sender] = true;
        return true;
    }

    //Add account to common registry
    function registerUser(uint256 userRoleType)
        public
        override
        hasSignedUp
        notRegistered
        returns (bool)
    {
        bool retVal = false;
        if (userRoleType == 1) {
            registeredUsers[msg.sender] = UserRoleType.Farmer;
            retVal = true;
        } else {
            if (userRoleType == 2) {
                registeredUsers[msg.sender] = UserRoleType.Donor;
                retVal = true;
            } else {
                if (userRoleType == 3) {
                    registeredUsers[msg.sender] = UserRoleType.Investor;
                    retVal = true;
                } else {
                    if (userRoleType == 4) {
                        registeredUsers[msg.sender] = UserRoleType
                            .ForwardMarketConsumer;
                        retVal = true;
                    } else {
                        if (userRoleType == 5) {
                            registeredUsers[msg.sender] = UserRoleType
                                .SportMarketConsumer;
                            retVal = true;
                        }
                    }
                }
            }
        }
        return retVal;
    }

    //Check if account has registered
    function isRegistered() public override view returns (bool) {
        return registeredUsers[msg.sender] != UserRoleType.DefaultPlaceholder;
    }

    //Check if account has signedUp
    function isSignedUp() public override view returns (bool) {
        return signedUpUsers[msg.sender] == true;
    }
}
