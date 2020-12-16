//import { randomId, random } from '../utils/helpers';
// import ContractProvider from '../components/utils/ContractProvider';
import Utility from '../common/Utility';
import StructStorage from '../artifacts/StructStorage';

export const initializeContext = (ctx, e) => (cb, onReceive) => {

    //this.setState({ loading: true });
    // const productContract = new this.state.web3.eth.Contract(StructStorage.abi, this.state.structStorageContractAddress);
    const performTransferPromise = {};
    // userRoletype = 3; //Hardcoded to Investor
    // const performTransferPromise = productContract.methods.fundProduct(receiverAccount, userRoletype, productID)
    //     .send({
    //         from: this.state.account,
    //         value: Number(contributionAmount)
    //     }).on('receipt', async (receipt) => {
    //         //await this.loadSupplychainHub()
    //         this.setState({ loading: false });
    //         console.log(receipt);
    //     }).on('error', function (error, receipt) {
    //         console.log(error);
    //         console.log(receipt);
    //         this.setState({ loading: false });
    //     });

    return performTransferPromise;
};


// A Callback service
// cb() let's up dispatch event to the parent
// onReceive() allows us to receive events from the parent while the service is running
export const transferFund = (ctx, e) => {

    console.log('transferFund', 'context',ctx, 'event',e);
    console.log('StructStorage',StructStorage,Utility.StructStorageContractAddress, Utility.Web3);
  
    //this.setState({ loading: true });
    const productContract = new Utility.Web3.eth.Contract(StructStorage.abi, Utility.StructStorageContractAddress);
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