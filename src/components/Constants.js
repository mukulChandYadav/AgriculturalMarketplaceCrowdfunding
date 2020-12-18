export const UserRoleToNum = {
    'DefaultUser': 0,
    'FarmerRole': 1,
    'DonorRole': 2,
    'Investor': 3,
    'ForwardMarketConsumerRole': 4,
    'SpotMarketConsumerRole': 5
};

export const NumToUserRole = {
    '0': 'Default User',
    '1': 'Farmer',
    '2': 'Donor',
    '3': 'Investor',
    '4': 'Forward Market Consumer',
    '5': 'Spot Market Consumer',
    '6': 'Marketplace Manager'
};

export const OrdinalToSupplyChainStatus = {
    '0': 'Default State',
    '1': 'Product Published',
    '2': 'Product Funded',
    '3': 'Harvested',
    '4': 'On Sale',
    '5': 'Sold'
};

export const SupplyChainStatusToOrdinal = {
    'Default State': '0',
    'Product Published': '1',
    'Product Funded': '2',
    'Harvested': '3',
    'On Sale': '4',
    'Sold': '5'
};

export const FundingStage = {
    Open: 0,
    FundingRaised: 1,
    CapReached: 2,
    EarlySuccess: 3,
    Success: 4,
    PaidOut: 5,
    Failed: 6
};
