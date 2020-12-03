// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

enum ProductFundingStatus {Active, Inactive, Expired, Closed}

enum FundingStage {
        Open,
        FundingRaised,
        CapReached,
        EarlySuccess,
        Success,
        PaidOut,
        Failed
    }

// struct CrowdFundedProductState {
//         uint256 upc;
//         uint256 sku;
//         address ownerID;
//         address originFarmerID;
//         string originFarmName;
//         string productNotes;
//         uint256 fundingCap;
//         uint256 deadline;
//         uint256 productPrice;
//         FundingStage fundingStage;
//         uint256 creationTime;
//     }
