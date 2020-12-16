import { assign } from "xstate";
// import Utility from '../common/Utility';
// import StructStorage from '../artifacts/StructStorage';
//import { transferFund1 } from './services';

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
          actions: assign({ 'transferringFund': (context, event) => event.payload.contributionAmount })
        }
      }
    },
    funding: {
      invoke: {
        id: 'fundProduct',
        src: 'transferFund',//(context, event) => transferFund(context,event),//
        onDone: [
          {
            target: 'funded',
            cond: 'isRequiredFundingAchieved',
            actions: assign({ 'transferringFund': (context, event) => undefined })
          },
          {
            target: 'productPublished',
            cond: 'requiredFundingNotAchieved',
          }
        ],
        onError: {
          target: 'productPublished',
          actions: assign({ 'transferringFund': (context, event) => undefined })
        }
      },
    },
    funded: {
      //entry: 'changeProductSupplychainStateToFunded',
      on: {
        PRODUCT_HARVEST: 'harvesting',
      }
    },
    harvesting: {
      invoke: {
        id: 'harvestProduct',
        src: 'productHarvest',
        onDone: {
          target: 'harvested',
        },
        onError: 'funded'
      }
    },
    harvested: {
      //entry: 'changeProductSupplychainStateToHarvested',
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
      //entry: 'changeProductSupplychainStateToOnSale',
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
      //entry: 'changeProductSupplychainStateToSold',
      type: 'final'
    },
    rejected: {
      type: 'final',
    }
  }
};