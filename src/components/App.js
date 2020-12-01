import StandardSupplychainHub from '../artifacts/StandardSupplychainHub.json';
import React, { Component } from 'react';
import Navbar from './Navbar';
import Form from './Form';
import Register from './Register';
import SignUp from './SignUp';
import Web3 from 'web3';
import './App.css';
import Routes from './Routes.js';

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
      await this.loadSupplychainHub();
    }
  }

  async detectSupplychainHub() {
    const urlParams = new URLSearchParams(window.location.search)
    const address = urlParams.get('address')
    this.setState({ contractAddress: address })
  }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      this.setState({ web3: web3 })
      return web3
    } else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
  }

  async loadBlockchainData() {
    const web3 = await this.loadWeb3()
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = StandardSupplychainHub.networks[networkId]
    if (networkData) {
      this.state.contractAddress = networkData.address;
      await this.loadSupplychainHub()
    } else {
      window.alert('SupplychainHub contract not deployed to detected network.')
    }
    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contractAddress: null,
      contract: {},
      loading: true
    }
  }

  async loadSupplychainHub() {
    const web3 = await this.loadWeb3()
    const contract = new web3.eth.Contract(StandardSupplychainHub.abi, this.state.contractAddress)
    const isUserSignedUp= await contract.methods.isSignedUp().call({ from: this.state.account })
    // contract.methods.isSignedUp().call({ from: this.state.account }, function(err, res){
    //   console.log(err);
    //   console.log(res);
    //   isUserSignedUp=res;
    // })
    const isUserRegistered = await contract.methods.isRegistered().call({ from: this.state.account })
    console.log(contract.methods, isUserRegistered, isUserSignedUp, this.state)
    this.setState({
      contract,
      isUserSignedUp,
      isUserRegistered
    })
  }

  publishProduct = async (args) => {
    this.setState({ loading: true })
    this.state.contract.methods.publishCrowdfundingProposal(args.upc,
      args.account,
      args.originFarmName,
      args.originFarmInfo,
      args.originFarmLat,
      args.originFarmLong,
      args.productNotes,
      args.fundingCap,
      args.deadline).send({
        from: this.state.account
      }).once('receipt', async (receipt) => {
        await this.loadSupplychainHub()
        this.setState({ loading: false })
      })
  }


  signUpUser = async () => {
    console.log("User sign up request received")
    this.setState({ loading: true })
    this.state.contract.methods.signUpUser()
      .send({
        from: this.state.account
      }).once('receipt', async (receipt) => {
        await this.loadSupplychainHub()
        this.setState({ loading: false })
      })
  }

  registerUser = async (userRoleType) => {
    this.setState({ loading: true })
    this.state.contract.methods.registerUser(userRoleType)
      .send({
        from: this.state.account
      }).once('receipt', async (receipt) => {
        await this.loadSupplychainHub()
        this.setState({ loading: false })
      })
  }


  renderContent() {
    if (this.state.loading) {
      return (
        <div id='loader' className='text-center'>
          <p className='text-center'>Loading...</p>
        </div>
      )
    }
    if (this.state.isUserSignedUp) {
      if (this.state.isUserRegistered) {
        return (
          <Form
            publishProduct={this.publishProduct} account={this.state.account}
          />
        )
      } else {
        return (
          <Register
            account={this.state.account}
          />
        )
      }
    } else {
      return (
        <SignUp
          signUpUser={this.signUpUser} account={this.state.account}
        />
      )
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