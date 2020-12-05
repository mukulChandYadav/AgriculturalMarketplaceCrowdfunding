// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./RegisterUserHub.sol";

contract StandardRegisterUserHub is RegisterUserHub {
    modifier notRegistered() {
        require(registeredUsers[msg.sender] == UserRoleType.DefaultPlaceholder);
        _;
    }

    modifier hasRegistered() {
        require(registeredUsers[msg.sender] != UserRoleType.DefaultPlaceholder);
        _;
    }

    //Add account to common registry
    function registerUser(string memory userName, uint256 userRoleType)
        public
        override
        notRegistered
        returns (bool)
    {
        bool retVal = false;
        if (userRoleType == 1) {
            registeredUsers[msg.sender] = UserRoleType.Farmer;
            addFarmer(msg.sender);
            retVal = true;
        } else {
            if (userRoleType == 2) {
                registeredUsers[msg.sender] = UserRoleType.Donor;
                addDonor(msg.sender);
                retVal = true;
            } else {
                if (userRoleType == 3) {
                    registeredUsers[msg.sender] = UserRoleType.Investor;
                    addInvestor(msg.sender);
                    retVal = true;
                } else {
                    if (userRoleType == 4) {
                        registeredUsers[msg.sender] = UserRoleType
                            .ForwardMarketConsumer;
                        addForwardMarketConsumer(msg.sender);
                        retVal = true;
                    } else {
                        if (userRoleType == 5) {
                            registeredUsers[msg.sender] = UserRoleType
                                .SportMarketConsumer;
                            addSpotMarketConsumer(msg.sender);
                            retVal = true;
                        }
                    }
                }
            }
        }
        userNames[msg.sender] = userName;
        return retVal;
    }

    //Check if account has registered
    function isRegistered() public override view returns (bool) {
        return registeredUsers[msg.sender] != UserRoleType.DefaultPlaceholder;
    }

    //Check if account has registered
    function getUserRole()
        public
        override
        view
        hasRegistered
        returns (UserRoleType)
    {
        return registeredUsers[msg.sender];
    }

    
    function getUserName()
        public
        override
        view
        hasRegistered
        returns (string memory)
    {
        return userNames[msg.sender];
    }
}
