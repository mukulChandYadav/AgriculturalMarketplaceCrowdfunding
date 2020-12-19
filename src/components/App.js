
import SupplychainHub from '../artifacts/SupplychainHub';
import ProductHub from '../artifacts/ProductHub';
import StandardRegisterUserHub from '../artifacts/StandardRegisterUserHub';
import React, { Component } from 'react';
import Navbar from './Navbar';
import Register from './Register';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import ProductListing from './productListing/ProductListing';
import { NumToUserRole, OrdinalToSupplyChainStatus } from './Constants';
import Utility from '../common/Utility';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';

import {
  interpret,
} from 'xstate';
import { SCFSM } from '../fsm/machine';



class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      account: '',
      registerUserHubContract: '',
      registerUserHubContractAddress: '',
      loading: true,
      productSCMachinesIndexedByID: [{}], // With place holder as upc starts at 1
      productSCServicesIndexedByID: [{}]
    }
    this.getPublishedProductDetails = this.getPublishedProductDetails.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.publishProduct = this.publishProduct.bind(this);
    //this.getProductDetails = this.getProductDetails.bind(this);
    this.postUserRating = this.postUserRating.bind(this);
    this.getUserAccountDetails = this.getUserAccountDetails.bind(this);
    this.loadContract = this.loadContract.bind(this);


    this.dumpState = this.dumpState.bind(this);
    this.useMachineExHelper = this.useMachineExHelper.bind(this);
    //this.notify = this.notify.bind(this);
  }


  async componentDidMount() {

    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();

    if (provider) {

      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');

        toaster.notify('Do you have multiple wallets installed?', {
          position: 'top-right',
        });
      } else {

        // Access the decentralized web!

        /**********************************************************/
        /* Handle chain (network) and chainChanged (per EIP-1193) */
        /**********************************************************/

        // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
        // returns incorrectly formatted chain ID values.

        window.ethereum.on('chainChanged', function (_chainId) {
          // We recommend reloading the page, unless you must do otherwise
          window.location.reload();
        });


        /***********************************************************/
        /* Handle user accounts and accountsChanged (per EIP-1193) */
        /***********************************************************/

        // Note that this event is emitted on page load.
        // If the array of accounts is non-empty, you're already
        // connected.
        window.ethereum.on('accountsChanged', function () { window.location.reload(); });


        await this.loadBlockchainData();
      }

    } else {
      toaster.notify('Please install MetaMask', {
        position: 'top-right',
      });
      console.log('Please install MetaMask');
      window.location.assign("https://metamask.io/");
    }
  }


  async createMachine(id, context) {

    const notify = (msg) => {
      toaster.notify(msg, {
        position: 'top-right',
      });
    };
    let machineRef = SCFSM.withContext({ //useRef
      ...context,
      notify, // passing side effect command to fsm
    });
    console.log('Machine return val ', machineRef);
    var newProductSCMachinesIndexedByIDState = this.state.productSCMachinesIndexedByID.concat({ 'id': id, 'ref': machineRef });
    this.setState({ productSCMachinesIndexedByID: newProductSCMachinesIndexedByIDState });

    //let machineState, machineSend;
    //[machineState, machineSend] =
    let serviceRefMetadata = this.useMachineExHelper(this.state.productSCMachinesIndexedByID[id], { debug: true, name: 'Parent' });
    var newProductSCServicesIndexedByIDState = this.state.productSCServicesIndexedByID.concat(serviceRefMetadata);
    this.setState({ productSCServicesIndexedByID: newProductSCServicesIndexedByIDState });
    //console.log()
    return serviceRefMetadata;
  }


  async loadWeb3() {


    if (this.state.web3 === undefined) {
      const web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });
      console.log("Web3 loaded");
      return web3;
    } else {
      return this.state.web3;
    }

  }

  async loadBlockchainData() {
    const web3 = Utility.Web3 = await this.loadWeb3();
    const accounts = await web3.eth.getAccounts();
    if (typeof accounts === undefined || accounts.length === 0) {
      console.log('No metamask account loaded.');
      toaster.notify('No metamask account loaded.', {
        position: 'top-right',
      });
    } else {
      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();

      await this.configureContracts(networkId);
    }
    this.setState({ loading: false });
  }

  async configureContracts(networkId) {

    // Get registerUserHub contract details
    const registerUserHubNetworkData = StandardRegisterUserHub.networks[networkId];
    if (registerUserHubNetworkData) {
      this.setState({
        'registerUserHubContractAddress': registerUserHubNetworkData.address
      });
      Utility.RegisterUserHubContractAddress = registerUserHubNetworkData.address;
      console.log("RegisterUserHub contract loaded:" + this.state.registerUserHubContractAddress);
      await this.loadContract(StandardRegisterUserHub, this.state.registerUserHubContractAddress, 'registerUserHubContract');
      Utility.RegisterUserHubContract = this.state.registerUserHubContract;
      await this.getUserAccountDetails();
    } else {
      toaster.notify('RegisterUserHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('RegisterUserHub contract not deployed to detected network');
    }


    // Get StandardProduct contract details
    const productHubNetworkData = ProductHub.networks[networkId];
    if (productHubNetworkData) {
      this.setState({
        'productHubContractAddress': productHubNetworkData.address
      });
      Utility.ProductHubContractAddress = productHubNetworkData.address;
      console.log("ProductHub contract loaded:" + this.state.productHubContractAddress);
      await this.loadContract(ProductHub, this.state.productHubContractAddress, 'productHubContract');
      Utility.ProductHubContract = this.state.productHubContract;
    } else {
      toaster.notify('ProductHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('ProductHub contract not deployed to detected network');
    }

    // Get SupplychainHub contract details
    const supplychainHubNetworkData = SupplychainHub.networks[networkId];
    if (supplychainHubNetworkData) {
      this.setState({
        'supplychainHubContractAddress': supplychainHubNetworkData.address
      });
      Utility.SupplychainHubContractAddress = supplychainHubNetworkData.address;
      console.log("SupplychainHub contract loaded:" + this.state.supplychainHubContractAddress);
      await this.loadContract(SupplychainHub, this.state.supplychainHubContractAddress, 'supplychainHubContract');
      Utility.SupplychainHubContract = this.state.supplychainHubContract;
    } else {
      toaster.notify('SupplychainHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('SupplychainHub contract not deployed to detected network');
    }
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
    this.state.productHubContract.methods.produce(
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
    if (this.state.productHubContract !== undefined && this.state.productHubContract !== '') {
      const productIDCounterInclusive = await this.state.productHubContract.methods.upc().call({
        from: this.state.account
      });
      console.log("productIDCounterInclusive", productIDCounterInclusive);

      for (var productID = 1; productID < productIDCounterInclusive; ++productID) {
        const productDetail = await this.state.productHubContract.methods
          .getproduce(productID)
          .call({ from: this.state.account });
        const accountUserName = await this.state.registerUserHubContract.methods
          .getUserNameOf(productDetail[6])
          .call({ from: this.state.account });
        const accountUserRating = await this.state.registerUserHubContract.methods
          .getUserRating(productDetail[6])
          .call({ from: this.state.account });
        const productSupplychainStatusOrdinal = await this.state.supplychainHubContract.methods
          .getSupplychainStatus(productID)
          .call({ from: this.state.account });
        let productInfo = {
          universalProductCode: productDetail[0],
          cropName: web3.utils.hexToAscii(productDetail[1]).replace(/[^A-Za-z0-9]/g, ''),
          quantity: productDetail[2],
          expectedPrice: productDetail[3],
          requiredFunding: productDetail[4],
          availableFunding: productDetail[5],
          ownerAccount: productDetail[6],
          ownerName: accountUserName,
          userRating: accountUserRating,
          supplyChainStage: OrdinalToSupplyChainStatus[productSupplychainStatusOrdinal]
        };

        //productDetail[productDetail.length] = accountUserName;
        //Spawn FSM to track this product supplychain state
        productInfo.machineMetadata = await this.createMachine(productInfo.universalProductCode, productInfo);

        // this.context.send({ type: 'NEW_SC_FSM.ADD', upc: productDetail[0] });
        // this.context.send({ type: 'SET_CONTEXT', data: data[productID - 1], actorID: 'scfsm-' + productDetail[0] });
        console.log('Machine state & control object', productInfo.machineMetadata);
        data.push(productInfo);
      }
      console.log("Product Details", data);

      const balance = await this.state.productHubContract.methods
        .getBalance(this.state.account)
        .call({ from: this.state.account });
      this.setState({ userBalance: balance });
      console.log(this.state.account + ":balance-" + balance);

    } else {

      toaster.notify('productHubContract not loaded', {
        position: 'top-right',
      });
      console.error("productHubContract not loaded");
    }

    return data;
  }


  async postUserRating(userRating, userAccount) {
    this.setState({ loading: true });
    const registerUserHubContract = new this.state.web3.eth.Contract(StandardRegisterUserHub.abi, this.state.registerUserHubContractAddress);
    //console.log("Post user rating", Number(userRating), userAccount);
    registerUserHubContract.methods.setUserRating(Number(userRating), userAccount)
      .send({
        from: this.state.account
      }).on('receipt', async (receipt) => {
        this.setState({ loading: false });
        console.log(receipt);
      }).on('error', function (error, receipt) {
        console.log(error);
        console.log(receipt);
        this.setState({ loading: false });
      });

  }



  // machine is raw state machine, will run it with the interpreter
  useMachineExHelper(machine, { debug = false, name = '', interpreterOptions = {} }) {
    // eslint-disable-next-line
    //const [_, force] = useState(0)
    const machineRef = machine.ref;

    let serviceRef = interpret(machineRef, interpreterOptions) // started Interpreter
      .onTransition(state => {

        if (state.event.type === 'xstate.init') {
          // debugger	//
          return;
        }
        //
        if (state.changed === false && debug === true) {
          console.error(
            `\n\n💣💣💣 [UNHANDLED EVENT][useMachine]💣💣💣\nEvent=`,
            state.event,

            '\nState=',
            state.value, state,

            '\nContext=',
            state.context,
            '\n\n');

          return;
        }

        if (debug === true) {
          console.group(`%c[useMachine ${name}]`, 'color: darkblue');
          this.dumpState(state.value);
          //this.dumpState(state.context);
          this.dumpState(state.event);
          console.log('ctx=', state.context);
          console.log('evt=', state.event);
          console.log('\n',);
          console.groupEnd();
        }

        // re-render if the state changed
        this.setState({ count: this.state.count + 1 });
        //force(x => x + 1)
      });

    // start immediately, as it's in the constructor
    serviceRef.start();



    // didMount
    // useEffect(() => {
    //   return () => {
    //     console.log('useMachine unload')
    //     serviceRef.current.stop()
    //   }
    // }, [])

    return { 'id': machine.id, 'state': serviceRef.state, 'send': serviceRef.send, 'ref': serviceRef };
  }

  // dump state tree in string format
  dumpState(item, depth = 1) {
    // if (depth == 1) console.log('\n')

    const MAX_DEPTH = 100
    depth = depth || 0
    let isString = typeof item === 'string'
    let isDeep = depth > MAX_DEPTH

    if (isString || isDeep) {
      console.log(item)
      return
    }

    for (var key in item) {
      console.group(key)
      this.dumpState(item[key], depth + 1)
      console.groupEnd()
    }
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
            postUserRating={this.postUserRating} publishProduct={this.publishProduct} getPublishedProductDetails={this.getPublishedProductDetails} account={this.state.account} userRole={this.state.userRole} {...this.state}
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
            {this.renderContent()}
            {/* <Routes></Routes> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;