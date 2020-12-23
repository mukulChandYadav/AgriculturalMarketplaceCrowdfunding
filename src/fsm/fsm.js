//import { assign } from "xstate";

export const fsm = {
  id: 'SupplychainFSM',
  initial: 'init',
  states: {
    init: {
      on: {
        '': [{
          target: 'productPublished',
          cond: 'isInitProductPublishedState'
        }, {
          target: 'funded',
          cond: 'isInitProductFundedState'
        },
        {
          target: 'harvested',
          cond: 'isInitProductHarvestedState'
        }, {
          target: 'onSale',
          cond: 'isInitProductOnSaleState'
        }, {
          target: 'sold',
          cond: 'isInitProductSoldState'
        },
        ]
      }
    },
    productPublished: {
      on: {
        FUND: {
          target: 'funding',
          //actions: assign({ 'transferringFund': (context, event) => event.payload.contributionAmount })
        }
      }
    },
    funding: {
      invoke: {
        id: 'fundProduct',
        src: 'transferFund',
        onDone: [
          {
            target: 'funded',
            cond: 'isRequiredFundingAchieved',
            //actions: assign({ 'transferringFund': (context, event) => undefined })
          },
          {
            target: 'productPublished',
            cond: 'requiredFundingNotAchieved',
          }
        ],
        onError: {
          target: 'productPublished',
          //actions: assign({ 'transferringFund': (context, event) => undefined })
        }
      },
    },
    funded: {
      on: {
        PRODUCT_HARVEST: 'harvesting',
      }
    },
    harvesting: {
      invoke: {
        id: 'harvestProduct',
        src: 'harvestProduct',
        onDone: {
          target: 'harvested',
        },
        onError: 'funded'
      }
    },
    harvested: {
      on: {
        PUT_ON_SALE: 'transferringToMarketPlace'
      }
    },
    transferringToMarketPlace: {
      invoke: {
        id: 'transferProductOwnershipToMarketplace',
        src: 'transferProductOwnershipToMarketplace',
        onDone: {
          target: 'onSale',

        },
        onError: 'harvested'
      }
    },
    onSale: {
      on: {
        SALE_TO_CUSTOMER: 'sellingToCustomer',
      }
    },
    sellingToCustomer: {
      invoke: {
        id: 'sellToCustomer',
        src: 'sellToCustomer',
        onDone: {
          target: 'sold',
        },
        onError: 'onSale'
      }
    },
    sold: {
      on: {
        '': [{
          target: 'settled',
          cond: 'areAllInvestorsPaid',
        }, {
          target: 'pendingInvestorSettlement',
          cond: 'allInvestorsNotPaid',
        }]
      }
    },
    pendingInvestorSettlement: {
      on: {
        PAYOUT_INVESTOR: 'payingInvestor',
      }
    },
    payingInvestor: {
      invoke: {
        id: 'payoutInvestor',
        src: 'payoutInvestor',
        onDone: [
          {
            target: 'sold',
          }
        ],
        onError: {
          target: 'pendingInvestorSettlement',
        }
      },
    },
    settled: {
      type: 'final'
    },
    rejected: {
      type: 'final',
    }
  }
};