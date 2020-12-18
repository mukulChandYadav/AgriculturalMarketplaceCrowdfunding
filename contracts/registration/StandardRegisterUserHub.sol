// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./RegisterUserHub.sol";

// Implementation for RegisterUserHub abstract class
contract StandardRegisterUserHub is RegisterUserHub {
    constructor() public Ownable() {}

    modifier notRegistered() {
        require(registeredUsers[msg.sender] == UserRoleType.DefaultPlaceholder);
        _;
    }

    modifier hasRegistered() {
        require(registeredUsers[msg.sender] != UserRoleType.DefaultPlaceholder);
        _;
    }

    //Add account to common registry
    function registerUserInternal(
        string memory userName,
        uint256 userRoleType,
        address payable account
    ) public returns (bool) {
        bool retVal = false;

        if (userRoleType == 1) {
            registeredUsers[account] = UserRoleType.Farmer;
            addFarmer(account);
            retVal = true;
        } else {
            if (userRoleType == 2) {
                registeredUsers[account] = UserRoleType.Donor;
                addDonor(account);
                retVal = true;
            } else {
                if (userRoleType == 3) {
                    registeredUsers[account] = UserRoleType.Investor;
                    addInvestor(account);
                    retVal = true;
                } else {
                    if (userRoleType == 4) {
                        registeredUsers[account] = UserRoleType
                            .ForwardMarketConsumer;
                        addForwardMarketConsumer(account);
                        retVal = true;
                    } else {
                        if (userRoleType == 5) {
                            registeredUsers[account] = UserRoleType
                                .SportMarketConsumer;
                            addSpotMarketConsumer(account);
                            retVal = true;
                        } else {
                            if (userRoleType == 6) {
                                registeredUsers[account] = UserRoleType
                                    .MarketplaceManager;
                                addMarketplaceManager(account);
                                retVal = true;
                            }
                        }
                    }
                }
            }
        }
        userNames[account] = userName;
        return retVal;
    }

    //Add account to common registry
    function registerUser(string calldata userName, uint256 userRoleType)
        external
        override
        notRegistered
        returns (bool)
    {
        return registerUserInternal(userName, userRoleType, msg.sender);
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

    // Get sender accounts registered userName
    function getUserName()
        public
        override
        view
        hasRegistered
        returns (string memory)
    {
        return userNames[msg.sender];
    }

    //Get username of another EOA user
    function getUserNameOf(address accountAddress)
        public
        view
        returns (
            //hasRegistered
            string memory
        )
    {
        return userNames[accountAddress];
    }
}
