import Utility from '../common/Utility';
import ProductHub from '../artifacts/ProductHub';



// A Callback service
// cb() let's up dispatch event to the parent
// onReceive() allows us to receive events from the parent while the service is running
export const transferFund = (ctx, e) => {

    console.log('transferFund', 'context',ctx, 'event',e);
    console.log('StructStorage',ProductHub,Utility.ProductHubContractAddress, Utility.Web3);

    //this.setState({ loading: true });
    const productContract = new Utility.Web3.eth.Contract(ProductHub.abi, Utility.ProductHubContractAddress);
    console.log('productContract',productContract);
    //const performTransferPromise = {};
    const userRoletype = 3; //Hardcoded to Investor
    const receiverAccount = e.payload.receiverAccount;
    const productID = ctx.universalProductCode;
    const senderAccount = e.payload.sender;
    const contributionAmount = e.payload.contributionAmount;
    console.log('receiverAccount',receiverAccount);
    const performTransferPromise = productContract.methods.fundProduct(receiverAccount, userRoletype, productID)
        .send({
            from: senderAccount,
            value: Number(contributionAmount)
        }).on('receipt', async (receipt) => {
            //await this.loadSupplychainHub()
            //this.setState({ loading: false });
            console.log(receipt);
        }).on('error', function (error, receipt) {
            console.log(error);
            console.log(receipt);
            //this.setState({ loading: false });
        });
  
    return performTransferPromise;
  };

  export const harvestProduct = (ctx, e) => {

    console.log('harvestProduct', 'context',ctx, 'event',e);
    console.log('StructStorage',ProductHub,Utility.ProductHubContractAddress, Utility.Web3);

    const productContract = new Utility.Web3.eth.Contract(ProductHub.abi, Utility.ProductHubContractAddress);
    console.log('productContract',productContract);
    
    //const userRoletype = 1; //Hardcoded to Farmer
    //const receiverAccount = e.payload.receiverAccount;
    const productID = ctx.universalProductCode;
    const senderAccount = e.payload.sender;
    const availableFunds = e.payload.availableFunds;
    //console.log('receiverAccount',receiverAccount);
    const performTransferPromise = productContract.methods.harvestProduct(productID)
        .send({
            from: senderAccount,
            value: Number(availableFunds)
        }).on('receipt', async (receipt) => {
            //await this.loadSupplychainHub()
            //this.setState({ loading: false });
            console.log(receipt);
        }).on('error', function (error, receipt) {
            console.log(error);
            console.log(receipt);
            //this.setState({ loading: false });
        });
  
    return performTransferPromise;
  };


  export const transferProductOwnershipToMarketplace = (ctx, e) => {

    console.log('transferProductOwnershipToMarketplace', 'context',ctx, 'event',e);
    console.log('StructStorage',ProductHub,Utility.ProductHubContractAddress, Utility.Web3);

    const productContract = new Utility.Web3.eth.Contract(ProductHub.abi, Utility.ProductHubContractAddress);
    console.log('productContract',productContract);
    
    //const userRoletype = 1; //Hardcoded to Farmer
    //const receiverAccount = e.payload.receiverAccount;
    const productID = ctx.universalProductCode;
    const senderAccount = e.payload.sender;
    const expectedPrice = e.payload.expectedPrice;
    //console.log('receiverAccount',receiverAccount);
    const performTransferPromise = productContract.methods.markProductForSale(productID)
        .send({
            from: senderAccount,
            value: Number(expectedPrice)
        }).on('receipt', async (receipt) => {
            //await this.loadSupplychainHub()
            //this.setState({ loading: false });
            console.log(receipt);
        }).on('error', function (error, receipt) {
            console.log(error);
            console.log(receipt);
            //this.setState({ loading: false });
        });
  
    return performTransferPromise;
  };


  export const sellToCustomer = (ctx, e) => {

    console.log('sellToCustomer', 'context',ctx, 'event',e);
    console.log('StructStorage',ProductHub,Utility.ProductHubContractAddress, Utility.Web3);

    const productContract = new Utility.Web3.eth.Contract(ProductHub.abi, Utility.ProductHubContractAddress);
    console.log('productContract',productContract);
    
    //const userRoletype = 1; //Hardcoded to Farmer
    //const receiverAccount = e.payload.receiverAccount;
    const productID = ctx.universalProductCode;
    const senderAccount = e.payload.sender;
    const expectedPrice = e.payload.expectedPrice;
    //console.log('receiverAccount',receiverAccount);
    const performTransferPromise = productContract.methods.saleToCustomer(productID)
        .send({
            from: senderAccount,
            value: Number(expectedPrice)
        }).on('receipt', async (receipt) => {
            //await this.loadSupplychainHub()
            //this.setState({ loading: false });
            console.log(receipt);
        }).on('error', function (error, receipt) {
            console.log(error);
            console.log(receipt);
            //this.setState({ loading: false });
        });
  
    return performTransferPromise;
  };
