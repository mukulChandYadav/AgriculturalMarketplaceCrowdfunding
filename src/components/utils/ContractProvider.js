//import StandardFundingHub from '../artifacts/StandardFundingHub';
//import FundingToken from '../artifacts/FundingToken';
import SupplychainHub from '../../artifacts/SupplychainHub';
import StructStorage from '../../artifacts/StructStorage';
import StandardRegisterUserHub from '../../artifacts/StandardRegisterUserHub';

import Web3 from 'web3';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import { Component } from 'react';

class ContractProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }

    this.loadContract = this.loadContract.bind(this);
  }

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

  async componentDidMount() {
    console.log('MainContext', this.context);
  }


  async loadWeb3() {
    if (typeof window.ethereum !== undefined) {
      const web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });
      console.log("Web3 loaded");
      return web3;
    } else {
      toaster.notify('Please install MetaMask', {
        position: 'top-right',
      });
      console.log('Please install MetaMask');
      window.location.assign("https://metamask.io/");
    }
  }

  async loadBlockchainData() {
    const web3 = await this.loadWeb3();
    const accounts = await web3.eth.getAccounts();
    if (typeof accounts === undefined || accounts.length === 0) {
      console.log('No metamask account loaded.');
      toaster.notify('No metamask account loaded.', {
        position: 'top-right',
      });
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
        //await this.getUserAccountDetails();
      } else {
        toaster.notify('RegisterUserHub contract not deployed to detected network', {
          position: 'top-right',
        });
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
        toaster.notify('StructStorage contract not deployed to detected network', {
          position: 'top-right',
        });
        console.log('StructStorage contract not deployed to detected network');
      }

      // Get SupplychainHub contract details
      const supplychainHubNetworkData = SupplychainHub.networks[networkId];
      if (supplychainHubNetworkData) {
        this.setState({
          'supplychainHubContractAddress': supplychainHubNetworkData.address
        });
        console.log("SupplychainHub contract loaded:" + this.state.supplychainHubContractAddress);
        await this.loadContract(SupplychainHub, this.state.supplychainHubContractAddress, 'supplychainHubContract');
      } else {
        toaster.notify('SupplychainHub contract not deployed to detected network', {
          position: 'top-right',
        });
        console.log('SupplychainHub contract not deployed to detected network');
      }
    }
    this.setState({ loading: false });
  }
  async loadContract(contractBytecode, contractAddress, stateVar) {
    const web3 = await this.loadWeb3();
    const contract = new web3.eth.Contract(contractBytecode.abi, contractAddress);
    this.state[stateVar] = contract;
    console.log("App state");
    console.log(this.state);
  }



}

export default ContractProvider;