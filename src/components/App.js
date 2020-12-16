//import StandardFundingHub from '../artifacts/StandardFundingHub';
//import FundingToken from '../artifacts/FundingToken';
//import SupplychainHub from '../artifacts/SupplychainHub';
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
//import {  PromiseRaceAll } from './utils/Util';
//import { DefaultToast } from 'react-toast-notifications';

class App extends Component {

  async componentWillMount() {
    if (window.ethereum !== undefined) {
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


  async loadWeb3() {
    if (typeof window.ethereum !== undefined) {
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
    if (typeof accounts === undefined || accounts.length === 0) {
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
      zeroAddr: '0x0000000000000000000000000000000000000000'
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
      console.log("Get username of call:" + await this.state.registerUserHubContract.methods.getUserNameOf(this.state.account).call({ from: this.state.account }));
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
      web3.utils.numberToHex(args.quantity),
      web3.utils.numberToHex(args.expectedPrice),
      web3.utils.numberToHex(args.requiredFunding)
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
      this.setState({ loading: false });
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
    if (this.state.structStorageContract !== undefined && this.state.structStorageContract !== '') {
      const productIDCounterInclusive = await this.state.structStorageContract.methods.upc().call({
        from: this.state.account
      });
      console.log("productIDCounterInclusive", productIDCounterInclusive);
      
      for (var productID = 1; productID < productIDCounterInclusive; ++productID) {
         const productDetail = await this.state.structStorageContract.methods
          .getproduce(productID)
          .call({ from: this.state.account });
        const accountUserName = await this.state.registerUserHubContract.methods
          .getUserNameOf(productDetail[6])
          .call({ from: this.state.account });
          data.push({
            universalProductCode: productDetail[0],
            cropName: web3.utils.hexToAscii(productDetail[1]).replace(/[^A-Za-z0-9]/g, ''),
            quantity: productDetail[2],
            expectedPrice: productDetail[3],
            requiredFunding: productDetail[4],
            availableFunding: productDetail[5],
            ownerAccount: productDetail[6],
            ownerName: accountUserName,
            supplyChainStage: 'Processing'
          });
          
        productDetail[productDetail.length] = accountUserName;
      }
      console.log("Product Details", data);
      
      const balance = await this.state.structStorageContract.methods
        .getBalance(this.state.account)
        .call({ from: this.state.account });
      this.setState({ userBalance: balance });
      console.log(this.state.account + ":balance-" + balance);

    } else {
      console.error("structStorageContract not loaded");
    }

    return data;
  }


  async fundProduct(receiverAccount, contributionAmount, userRoletype, productID) {
    this.setState({ loading: true });
    const productContract = new this.state.web3.eth.Contract(StructStorage.abi, this.state.structStorageContractAddress);

    userRoletype = 3; //Hardcoded to Investor
    productContract.methods.fundProduct(receiverAccount, userRoletype, productID)
      .send({
        from: this.state.account,
        value: Number(contributionAmount)
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
          (this.state.registerUserHubContract !== undefined && this.state.registerUserHubContract !== '') ?
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
        <Navbar account={this.state.account} userName={this.state.userName} userRole={this.state.userRole} userBalance={this.state.userBalance} />
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