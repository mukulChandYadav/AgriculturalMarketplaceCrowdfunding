// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./RegisterUserHub.sol";
import "../utils/Math.sol";

// Implementation for RegisterUserHub abstract class
contract StandardRegisterUserHub is RegisterUserHub {
    constructor() public Ownable() {}

    modifier notRegistered() {
        require(
            userStore[msg.sender].userRoleType ==
                UserRoleType.DefaultPlaceholder
        );
        _;
    }

    modifier hasRegistered() {
        require(
            userStore[msg.sender].userRoleType !=
                UserRoleType.DefaultPlaceholder
        );
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
            userStore[account].userRoleType = UserRoleType.Farmer;
            addFarmer(account);
            retVal = true;
        } else {
            if (userRoleType == 2) {
                userStore[account].userRoleType = UserRoleType.Donor;
                addDonor(account);
                retVal = true;
            } else {
                if (userRoleType == 3) {
                    userStore[account].userRoleType = UserRoleType.Investor;
                    addInvestor(account);
                    retVal = true;
                } else {
                    if (userRoleType == 4) {
                        userStore[account].userRoleType = UserRoleType
                            .ForwardMarketConsumer;
                        addForwardMarketConsumer(account);
                        retVal = true;
                    } else {
                        if (userRoleType == 5) {
                            userStore[account].userRoleType = UserRoleType
                                .SportMarketConsumer;
                            addSpotMarketConsumer(account);
                            retVal = true;
                        } else {
                            if (userRoleType == 6) {
                                userStore[account].userRoleType = UserRoleType
                                    .MarketplaceManager;
                                addMarketplaceManager(account);
                                retVal = true;
                            }
                        }
                    }
                }
            }
        }
        userStore[account].userName = userName;
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
        return isRegisteredUser(msg.sender);
    }

    //Check if account has registered
    function isRegisteredUser(address user) public view returns (bool) {
        return userStore[user].userRoleType != UserRoleType.DefaultPlaceholder;
    }

    //Check if account has registered
    function getUserRole()
        public
        override
        view
        hasRegistered
        returns (UserRoleType)
    {
        return userStore[msg.sender].userRoleType;
    }

    // Get sender accounts registered userName
    function getUserName()
        public
        override
        view
        hasRegistered
        returns (string memory)
    {
        return userStore[msg.sender].userName;
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
        return userStore[accountAddress].userName;
    }

    //Get user rating assigned to account
    function getUserRating(address user) public override view returns (int256) {
        require(isRegisteredUser(user), "Provided user not registered");
        return userStore[user].rating;
    }

    //Update user rating assigned to account
    function setUserRating(int256 providedRating, address user)
        public
        override
        returns (bool)
    {
        require(isRegisteredUser(user), "Provided user not registered");
        require(user != msg.sender, "User cannot rate himself");
        int256 totalReviewCount = Math.add(userStore[user].reviewsReceived, 1);
        int256 revisedDiff = Math.sub(providedRating, userStore[user].rating);
        int256 revisedRatingPoint = revisedDiff/ totalReviewCount;
        userStore[user].rating = Math.add(userStore[user].rating, revisedRatingPoint);
        userStore[user].reviewsReceived = totalReviewCount;
        return true;
    }
}
