
export const UserRoleToNum = {
    'DefaultUser': 0,
    'FarmerRole': 1,
    'DonorRole': 2,
    'InvestorRole': 3,
    'ForwardMarketConsumerRole': 4,
    'SpotMarketConsumerRole': 5
};


export const NumToUserRole = {
    '0': 'DefaultUser',
    '1': 'Farmer',
    '2': 'Donor',
    '3': 'Investor',
    '4': 'ForwardMarketConsumer',
    '5': 'SpotMarketConsumer'
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
