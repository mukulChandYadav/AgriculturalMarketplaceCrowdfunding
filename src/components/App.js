import StandardSupplychainHub from '../artifacts/StandardSupplychainHub.json';
import CrowdFundedProduct from '../artifacts/CrowdFundedProduct.json';
import React, { Component } from 'react';
import Navbar from './Navbar';
import Register from './Register';
import Web3 from 'web3';
import './App.css';
import Routes from './Routes.js';
import ProductListing from './ProductListing';

class App extends Component {

  async componentWillMount() {
    if (window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      await this.detectSupplychainHub();
      await this.loadWeb3();
      await this.loadBlockchainData();
      //await this.loadSupplychainHub();
    }
  }

  async detectSupplychainHub() {
    const urlParams = new URLSearchParams(window.location.search);
    const address = urlParams.get('address');
    this.setState({ contractAddress: address });
  }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });
      console.log("Web3 loaded");
      return web3
    } else {
      window.alert('Please install MetaMask');
      window.location.assign("https://metamask.io/");
    }
  }

  async loadBlockchainData() {
    const web3 = await this.loadWeb3();
    const accounts = await web3.eth.getAccounts();
    if (typeof accounts === 'undefined' || accounts.length === 0) {
      window.alert('No metamask account loaded.');
    } else {
      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();
      const networkData = StandardSupplychainHub.networks[networkId]

      if (networkData) {
        this.state.contractAddress = networkData.address;
        console.log("blockchain loaded:" + this.state.contractAddress)
        await this.loadSupplychainHub();
      } else {
        window.alert('SupplychainHub contract not deployed to detected network.')
      }
    }

    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contractAddress: null,
      contract: {},
      loading: true,
      zeroAddr: '0x0000000000000000000000000000000000000000'
    }
    this.getPublishedProductDetails = this.getPublishedProductDetails.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.publishProduct = this.publishProduct.bind(this);
    this.getProductDetails = this.getProductDetails.bind(this);
  }

  async loadSupplychainHub() {
    const web3 = await this.loadWeb3();
    const contract = new web3.eth.Contract(StandardSupplychainHub.abi, this.state.contractAddress);
    var userRole = 0;

    const isUserRegistered = await contract.methods.isRegistered().call({ from: this.state.account });
    if (isUserRegistered) {
      userRole = await contract.methods.getUserRole().call({ from: this.state.account });
    }
    console.log("Is User Registered:" + isUserRegistered + " " + this.state.account + ", userRole:" + userRole);
    this.setState({
      contract,
      isUserRegistered,
      userRole
    });
    console.log("App state")
    console.log(this.state);
  }

  async publishProduct(args) {
    this.setState({ loading: true });
    this.state.contract.methods.publishCrowdfundingProposal(args.sku,
      args.account,
      args.originFarmName,
      args.productNotes,
      args.fundingCap,
      args.deadline).send({
        from: this.state.account
      }).on('receipt', async (receipt) => {
        await this.loadSupplychainHub()
        console.log(receipt)
        this.setState({ loading: false })
      }).on('error', function (error, receipt) {
        console.log(error);
        console.log(receipt);
      });
  }


  async registerUser(userRoleType) {
    this.setState({ loading: true })
    this.state.contract.methods.registerUser(userRoleType)
      .send({
        from: this.state.account
      }).on('receipt', async (receipt) => {
        //await this.loadSupplychainHub()
        this.setState({ loading: false });
        console.log(receipt);
      }).on('error', function (error, receipt) {
        console.log(error);
        console.log(receipt);
      });
  }

  async getPublishedProductDetails() {
    const productAddresses = await this.state.contract.methods.getProductAddresses().call({
      from: this.state.account
    });
    var data = [];
    var productDetailsPromises = [];
    productAddresses.forEach(productAddress => {
      if (productAddress !== this.state.zeroAddr) {
        const productDetailsPromise = this.getProductDetails(productAddress);
        productDetailsPromises.push(productDetailsPromise);
      }
    });
    await Promise.all(productDetailsPromises);
    productDetailsPromises.forEach(productDetailsPromise => {
      productDetailsPromise
        .then(function(productDetails) {
          data.push(productDetails);
        });
    });
    console.log(data);
    return data;
  }





  async getProductDetails(productAddress) {
    const productContract = new this.state.web3.eth.Contract(CrowdFundedProduct.abi, productAddress);

    var productDetails = {};
    if (productAddress !== this.state.zeroAddr) {
      productDetails.ownerID = await productContract.methods.ownerID().call({ from: this.state.account });

      productDetails.upc = await productContract.methods.upc().call({ from: this.state.account });
      productDetails.sku = await productContract.methods.sku().call({ from: this.state.account });

      productDetails.originFarmerID = await productContract.methods.originFarmerID().call({ from: this.state.account });
      productDetails.originFarmName = await productContract.methods.originFarmName().call({ from: this.state.account });

      //productDetails.productNotes = await productContract.methods.productNotes().call({ from: this.state.account });
      productDetails.productPrice = await productContract.methods.productPrice().call({ from: this.state.account });

      //productDetails.fundingStage = await productContract.methods.fundingStage().call({ from: this.state.account });

      productDetails.beneficiary = await productContract.methods.beneficiary().call({ from: this.state.account });
      productDetails.fundingCap = await productContract.methods.fundingCap().call({ from: this.state.account });

      productDetails.deadline = await productContract.methods.deadline().call({ from: this.state.account });
      productDetails.creationTime = await productContract.methods.creationTime().call({ from: this.state.account });
    }
    //console.log(productDetails);
    return productDetails;
  }




  // getContractState(abi_object, contract_instance, dataElement) {
  //   for (let i = 0; i < abi_object.length; i++) {
  //     if (abi_object[i].constant === true &&
  //       abi_object[i].inputs.length === 0 &&
  //       //abi_object[i].payable === false &&
  //       abi_object[i].type === "function") {
  //       dataElement[abi_object[i].name] = contract_instance.methods[abi_object[i].name].call();
  //       console.log(abi_object[i].name + "=" + dataElement[abi_object[i].name]);
  //       contract_instance.methods[abi_object[i].name].call.call((error, res) => {
  //         console.log(res);
  //       });
  //     }
  //   }
  // }

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
            publishProduct={this.publishProduct} getPublishedProductDetails={this.getPublishedProductDetails} account={this.state.account} userRole={this.state.userRole} {...this.state}
          />
        )
      } else {
        return (
          <Register
            registerUser={this.registerUser} account={this.state.account}
          />
        )
      }
    }

  }

  render() {
    return (
      <div className="text-monospace">
        <Navbar account={this.state.account} />
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