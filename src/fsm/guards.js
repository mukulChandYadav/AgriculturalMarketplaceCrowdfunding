import { SupplyChainStatusToOrdinal } from '../components/Constants';

export const isRequiredFundingAchieved = (ctx) => {
    let result = (Number(ctx.requiredFunding) === Number(ctx.transferringFund));
    console.log('isRequiredFundingAchieved', result, 'ctx.context.requiredFunding', ctx.requiredFunding, 'ctx.context.transferringFund', ctx.transferringFund);
    return result;
};

export const requiredFundingNotAchieved = (ctx) => {
    let result = (ctx.requiredFunding !== ctx.transferringFund);
    console.log('requiredFundingNotAchieved', result);
    return result;
};

export const isInitProductPublishedState = (context) => {
    let result = Number(SupplyChainStatusToOrdinal[context.supplyChainStage]) === 1;
    console.log('isProductPublishedState', result, 'context.supplyChainStage', context.supplyChainStage, 'Number(SupplyChainStatusToOrdinal[context.supplyChainStage])', Number(SupplyChainStatusToOrdinal[context.supplyChainStage]));
    return result;
};

export const isInitProductFundedState = (context) => {
    let result = Number(SupplyChainStatusToOrdinal[context.supplyChainStage]) === 2;
    console.log('isInitProductFundedState', result, 'context.supplyChainStage', context.supplyChainStage, 'Number(SupplyChainStatusToOrdinal[context.supplyChainStage])', Number(SupplyChainStatusToOrdinal[context.supplyChainStage]));
    return result;
};

export const isInitProductHarvestedState = (context) => {
    let result = Number(SupplyChainStatusToOrdinal[context.supplyChainStage]) === 3;
    console.log('isInitProductHarvestedState', result, 'context.supplyChainStage', context.supplyChainStage, 'Number(SupplyChainStatusToOrdinal[context.supplyChainStage])', Number(SupplyChainStatusToOrdinal[context.supplyChainStage]));
    return result;
};

export const isInitProductOnSaleState = (context) => {
    let result = Number(SupplyChainStatusToOrdinal[context.supplyChainStage]) === 4;
    console.log('isInitProductOnSaleState', result, 'context.supplyChainStage', context.supplyChainStage, 'Number(SupplyChainStatusToOrdinal[context.supplyChainStage])', Number(SupplyChainStatusToOrdinal[context.supplyChainStage]));
    return result;
};

export const isInitProductSoldState = (context) => {
    let result = Number(SupplyChainStatusToOrdinal[context.supplyChainStage]) === 5;
    console.log('isInitProductSoldState', result, 'context.supplyChainStage', context.supplyChainStage, 'Number(SupplyChainStatusToOrdinal[context.supplyChainStage])', Number(SupplyChainStatusToOrdinal[context.supplyChainStage]));
    return result;
};


export const areAllInvestorsPaid = (context) => {
    console.log('Investors Not Paid', context.investorsToBePaidOut);
    return context.investorsToBePaidOut.length === 0;
};

export const allInvestorsNotPaid = (context) => {
    console.log('Investors Not Paid', context.investorsToBePaidOut);
    return context.investorsToBePaidOut.length !== 0;
};
