export const fsm = {
    id: 'Supplychain API',
    initial: 'productPublished',
    context: {
        product: {
            name: 'Wheat',
            scStage: 'published',
            owner: 'farmer',
            requiredFund: 100,
            availableFund: 0,
            expectedPrice: 150
        }
    },
    states: {
        productPublished: {
            on: {
                FUND: 'funding'
            }
        },
        funding: {
            invoke: {
                id: 'fundProduct',
                src: (context, event) => fetch('https://dog.ceo/api/breeds/image/random')
                    .then(data => data.json()),
                onDone: {
                    target: 'funded',
                    actions: assign({
                        product: (_, event) => event.data
                    })
                },
                onError: 'productPublished'
            },
            on: {
                CANCEL: 'productPublished'
            }
        },
        funded: {
            invoke: {
                id: 'harvestProduct',
                src: (context, event) => fetch('https://dog.ceo/api/breeds/image/random')
                    .then(data => data.json()),
                onDone: {
                    target: 'onSale',
                    actions: assign({
                        product: (_, event) => event.data
                    })
                },
                onError: 'rejected'
            },
            on: {
                CANCEL: 'productPublished'
            }
        },
        onSale: {
            invoke: {
                id: 'saleToMarketplace',
                src: (context, event) => fetch('https://dog.ceo/api/breeds/image/random')
                    .then(data => data.json()),
                onDone: {
                    target: 'saleToCustomer',
                    actions: assign({
                        product: (_, event) => event.data
                    })
                },
                onError: 'funded'
            },
            on: {
                CANCEL: 'funded'
            }
        },
        saleToCustomer: {
            invoke: {
                id: 'saleToMarketplace',
                src: (context, event) => fetch('https://dog.ceo/api/breeds/image/random')
                    .then(data => data.json()),
                onDone: {
                    target: 'sold',
                    actions: assign({
                        product: (_, event) => event.data
                    })
                },
                onError: 'onSale'
            },
            on: {
                CANCEL: 'onSale'
            }
        },
        sold: {
            type: 'final'
        },
        rejected: {
            type: 'final',
            invoke: {
                id: 'releaseRemainingFunds',
                src: (context, event) => fetch('https://dog.ceo/api/breeds/image/random')
                    .then(data => data.json())
            },
            onError: 'funded'
        }
    }
}