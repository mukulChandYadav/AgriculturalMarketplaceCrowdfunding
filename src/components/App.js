//import StandardFundingHub from '../artifacts/StandardFundingHub';
//import FundingToken from '../artifacts/FundingToken';
import StructStorage from '../artifacts/StructStorage';
import StandardRegisterUserHub from '../artifacts/StandardRegisterUserHub';
import React, { Component } from 'react';
import Navbar from './Navbar';
import Register from './Register';
import Web3 from 'web3';
import './App.css';
import Routes from './Routes.js';
import ProductListing from './productListing/ProductListing';
import { NumToUserRole } from './Constants';
//import { DefaultToast } from 'react-toast-notifications';

class App extends Component {

  async componentWillMount() {
    if (window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      await this.loadWeb3();
      await this.loadBlockchainData();
    }
  }

  // async detectSupplychainHub() {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const address = urlParams.get('address');
  //   this.setState({ contractAddress: address });
  // }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });
      console.log("Web3 loaded");
      return web3;
    } else {
      // const { addToast } = useToasts();
      // addToast('Please install MetaMask', {
      //   appearance: 'error',
      //   autoDismiss: true,
      // });
      console.log('Please install MetaMask');
      window.location.assign("https://metamask.io/");
    }
  }

  async loadBlockchainData() {
    const web3 = await this.loadWeb3();
    const accounts = await web3.eth.getAccounts();
    if (typeof accounts === 'undefined' || accounts.length === 0) {
      console.log('No metamask account loaded.');
    } else {
      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();

      // Get registerUserHub contract details
      const registerUserHubNetworkData = StandardRegisterUserHub.networks[networkId];
      if (registerUserHubNetworkData) {
        this.setState({
          'registerUserHubContractAddress': registerUserHubNetworkData.address
        });
        console.log("RegisterUserHub contract loaded:" + this.state.registerUserHubContractAddress);
        await this.loadContract(StandardRegisterUserHub, this.state.registerUserHubContractAddress, 'registerUserHubContract');
        await this.getUserAccountDetails();
      } else {
        // const { addToast } = useToasts();
        // addToast('RegisterUserHub contract not deployed to detected network.', {
        //   appearance: 'error',
        //   autoDismiss: true,
        // });
        console.log('RegisterUserHub contract not deployed to detected network');
      }


      // Get fundingHub contract details
      // const fundingHubNetworkData = StandardFundingHub.networks[networkId];
      // if (fundingHubNetworkData) {
      //   this.setState({
      //     'fundingHubContractAddress': fundingHubNetworkData.address
      //   });
      //   console.log("StandardFundingHub contract loaded:" + this.state.fundingHubContractAddress);
      //   await this.loadContract(StandardFundingHub, this.state.fundingHubContractAddress, 'fundingHubContract');
      // } else {
      //   // const { addToast } = useToasts();
      //   // addToast('StandardFundingHub contract not deployed to detected network.', {
      //   //   appearance: 'error',
      //   //   autoDismiss: true,
      //   // });
      //   console.log('StandardFundingHub contract not deployed to detected network');
      // }

      // Get fundingHub contract details
      // const fundingTokenNetworkData = FundingToken.networks[networkId];
      // if (fundingTokenNetworkData) {
      //   this.setState({
      //     'fundingHubContractAddress': fundingHubNetworkData.address
      //   });
      //   console.log("FundingToken contract loaded:" + this.state.fundingTokenContractAddress);
      //   await this.loadContract(FundingToken, this.state.fundingTokenContractAddress, 'fundingTokenContract');
      // } else {
      //   // const { addToast } = useToasts();
      //   // addToast('FundingToken contract not deployed to detected network.', {
      //   //   appearance: 'error',
      //   //   autoDismiss: true,
      //   // });
      //   console.log('FundingToken contract not deployed to detected network');
      // }

      // Get StandardProduct contract details
      const structStorageNetworkData = StructStorage.networks[networkId];
      if (structStorageNetworkData) {
        this.setState({
          'structStorageContractAddress': structStorageNetworkData.address
        });
        console.log("StructStorage contract loaded:" + this.state.structStorageContractAddress);
        await this.loadContract(StructStorage, this.state.structStorageContractAddress, 'structStorageContract');
      } else {
        // const { addToast } = useToasts();
        // addToast('StandardProduct contract not deployed to detected network.', {
        //   appearance: 'error',
        //   autoDismiss: true,
        // });
        console.log('StructStorage contract not deployed to detected network');
      }
    }
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      registerUserHubContract: '',
      registerUserHubContractAddress: '',
      loading: true,
      zeroAddr: '0x0000000000000000000000000000000000000000',
      userName: '',
      userRole: ''
    }
    this.getPublishedProductDetails = this.getPublishedProductDetails.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.publishProduct = this.publishProduct.bind(this);
    //this.getProductDetails = this.getProductDetails.bind(this);
    this.fundProduct = this.fundProduct.bind(this);
    this.getUserAccountDetails = this.getUserAccountDetails.bind(this);
    this.loadContract = this.loadContract.bind(this);
  }

  async loadContract(contractBytecode, contractAddress, stateVar) {
    const web3 = await this.loadWeb3();
    const contract = new web3.eth.Contract(contractBytecode.abi, contractAddress);
    this.state[stateVar] = contract;
    console.log("App state");
    console.log(this.state);
  }

  async getUserAccountDetails() {

    const isUserRegistered = await this.state.registerUserHubContract.methods.isRegistered().call({ from: this.state.account });
    if (isUserRegistered) {
      const userRole = await this.state.registerUserHubContract.methods.getUserRole().call({ from: this.state.account });
      const userName = await this.state.registerUserHubContract.methods.getUserName().call({ from: this.state.account });

      this.setState({
        'userRole': NumToUserRole[userRole],
        'userName': userName
      });
      console.log("userRole:" + this.state.userRole);
    }

    this.setState({
      'isUserRegistered': isUserRegistered
    });
    console.log("Is User Registered:" + isUserRegistered + " " + this.state.account);
  }


  async publishProduct(args) {
    this.setState({ loading: true });
    const web3 = this.state.web3;
    console.log(args, web3.utils.asciiToHex(args.cropName),
      parseInt(args.quantity),
      parseInt(args.expectedPrice),
      parseInt(args.requiredFunding)
    );
    this.state.structStorageContract.methods.produce(
      web3.utils.asciiToHex(args.cropName),
      parseInt(args.quantity),
      parseInt(args.expectedPrice),
      parseInt(args.requiredFunding)
      //args.sku,
      //args.account,
      //args.productPrice,
      //args.originFarmName,
      //args.productNotes,
      //args.fundingCap,
      //args.deadline
    ).send({
      from: this.state.account,
      gas: 2000000
    }).on('receipt', async (receipt) => {
      console.log(receipt);
      this.setState({ loading: false });
    }).on('error', function (error, receipt) {
      console.log(error);
      console.log(receipt);
    });
  }


  async registerUser(userName, userRoleType) {
    this.setState({ loading: true });
    this.state.registerUserHubContract.methods.registerUser(userName, userRoleType)
      .send({
        from: this.state.account
      }).on('receipt', async (receipt) => {
        //await this.loadSupplychainHub()
        this.setState({ loading: false });
        console.log(receipt);
      }).on('error', function (error, receipt) {
        console.log(error);
        console.log(receipt);
        this.setState({ loading: false });
      });
  }

  async getPublishedProductDetails() {
    const web3 = this.state.web3;
    var data = [];
    if (this.state.structStorageContract !== 'undefined' && this.state.structStorageContract !== '') {
      const productIDCounterInclusive = await this.state.structStorageContract.methods.upc().call({
        from: this.state.account
      });
      console.log("productIDCounterInclusive", productIDCounterInclusive);
      var productDetailsPromises = [];
      for (var productID = 1; productID < productIDCounterInclusive; ++productID) {
        const productDetailsPromise = this.state.structStorageContract.methods
          .getproduce(productID)
          .call({ from: this.state.account });
        productDetailsPromises.push(productDetailsPromise);
      }
      await Promise.all(productDetailsPromises);
      productDetailsPromises.forEach(productDetailsPromise => {
        productDetailsPromise
          .then(function (productDetails) {

            data.push({
              universalProductCode: productDetails[0],
              cropName: web3.utils.hexToAscii(productDetails[1]),
              quantity: productDetails[2],
              expectedPrice: productDetails[3],
              requiredFunding: productDetails[4],
              availableFunding: productDetails[5],
              ownerAccount: productDetails[6],
            });
          });
      });
      const balance = await this.state.structStorageContract.methods
        .getBalance(this.state.account)
        .call({ from: this.state.account });
      this.setState({ userBalance: balance });
      console.log(this.state.account+":balance-"+balance);
      console.log(data);
    } else {
      console.error("structStorageContract not loaded");
    }

    return data;
  }

  // async getProductDetails(productAddress) {
  //   const productContract = new this.state.web3.eth.Contract(StructStorage.abi, productAddress);

  //   var productDetails = {};
  //   if (productAddress !== this.state.zeroAddr) {
  //     productDetails.ownerID = await productContract.methods.ownerID().call({ from: this.state.account });

  //     productDetails.upc = await productContract.methods.upc().call({ from: this.state.account });
  //     productDetails.sku = await productContract.methods.sku().call({ from: this.state.account });
  //     productDetails.productSupplyChainState = await productContract.methods.productSupplyChainState().call({ from: this.state.account });

  //     productDetails.originFarmerID = await productContract.methods.originFarmerID().call({ from: this.state.account });
  //     //productDetails.originFarmName = await productContract.methods.originFarmName().call({ from: this.state.account });

  //     //productDetails.productNotes = await productContract.methods.productNotes().call({ from: this.state.account });
  //     productDetails.productPrice = await productContract.methods.productPrice().call({ from: this.state.account });

  //     productDetails.fundingStage = await productContract.methods.fundingStage().call({ from: this.state.account });

  //     productDetails.beneficiary = await productContract.methods.beneficiary().call({ from: this.state.account });
  //     productDetails.fundingCap = await productContract.methods.fundingCap().call({ from: this.state.account });

  //     productDetails.deadline = await productContract.methods.deadline().call({ from: this.state.account });
  //     productDetails.creationTime = await productContract.methods.creationTime().call({ from: this.state.account });
  //     productDetails.productContractAddress = productAddress;
  //   }
  //   //console.log(productDetails);
  //   return productDetails;
  // }

  async fundProduct(receiverAccount, contributionAmount, senderAccount, productID) {
    this.setState({ loading: true });
    const productContract = new this.state.web3.eth.Contract(StructStorage.abi, this.state.structStorageContractAddress);

    // const amountRaised = await productContract.methods.amountRaised().call({ from: this.state.account });
    // console.log(amountRaised);

    productContract.methods.fundProduct(receiverAccount, contributionAmount, senderAccount, productID)
      .send({
        from: this.state.account
      }).on('receipt', async (receipt) => {
        //await this.loadSupplychainHub()
        this.setState({ loading: false });
        console.log(receipt);
      }).on('error', function (error, receipt) {
        console.log(error);
        console.log(receipt);
        this.setState({ loading: false });
      });


    //     this.state.contract.methods.contribute(productAddress, contributionAmount)
    //       .send({
    //         from: this.state.account
    //       }).on('receipt', async (receipt) => {
    //         //await this.loadSupplychainHub()
    //         this.setState({ loading: false });
    //         console.log(receipt);
    //       }).on('error', function (error, receipt) {
    //         console.log(error);
    //         console.log(receipt);
    //         this.setState({ loading: false });
    //       });
  }


  renderContent() {
    if (this.state.loading) {
      return (
        <div id='loader' className='text-center'>
          <p className='text-center'>Loading...</p>
        </div>
      )
    } else {
      if (this.state.isUserRegistered) {
        return (
          <ProductListing
            fundProduct={this.fundProduct} publishProduct={this.publishProduct} getPublishedProductDetails={this.getPublishedProductDetails} account={this.state.account} userRole={this.state.userRole} {...this.state}
          />
        )
      } else {
        return (
          (this.state.registerUserHubContract !== 'undefined' && this.state.registerUserHubContract !== '') ?
            (< Register
              registerUser={this.registerUser} account={this.state.account}
            />) : null
        )
      }
    }

  }

  render() {
    return (
      <div className="text-monospace">
        <Navbar account={this.state.account} userName={this.state.userName} userRole={this.state.userRole} userBalance={this.state.userBalance}/>
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main role='main' className="col-lg-12 ml-auto mr-auto">
              {this.renderContent()}
              <Routes></Routes>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;