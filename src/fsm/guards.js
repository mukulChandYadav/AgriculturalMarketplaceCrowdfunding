export const isRequiredFundingAchieved = (ctx, e) => {
    let result = (ctx.requiredFunding === 0);
    console.log('isRequiredFundingAchieved', result);
    return result;
};

export const requiredFundingNotAchieved = ctx => {
    let result = (ctx.requiredFunding !== 0);
    console.log('requiredFundingNotAchieved', result);
    return result;
};