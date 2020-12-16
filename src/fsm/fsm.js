//import { assign } from "xstate";
export const fsm = {
    id: 'SupplychainFSM',
    initial: 'productPublished',
    states: {
        productPublished: {
            on: {
                FUND: 'funding'
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
              },
              {
                target: 'productPublished',
                cond: 'requiredFundingNotAchieved',
              }
              ],
              onError: 'productPublished'
          },
        },
        funded: {
            entry: 'changeProductSupplychainStateToFunded',
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
          entry: 'changeProductSupplychainStateToHarvested',
            on: {
                PUT_ON_SALE:  'transferringToMarketPlace'
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
            entry: 'changeProductSupplychainStateToOnSale',
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
          entry: 'changeProductSupplychainStateToSold',
            type: 'final'
        },
        rejected: {
            type: 'final',
        }
    }
};