// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

enum ProductFundingStatus {Active, Inactive, Expired, Closed}

enum FundingStage {
        Open, //0
        FundingRaised, //1
        CapReached, //2
        EarlySuccess, //3
        Success, //4
        PaidOut, //5
        Failed //6
    }

