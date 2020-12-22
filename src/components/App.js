
import SupplychainHub from '../artifacts/SupplychainHub';
import ProductHub from '../artifacts/ProductHub';
import RegisterUserHubContract from '../artifacts/StandardRegisterUserHub';
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
      loading: true,
      productSCMachinesIndexedByID: [{}], // With place holder as upc starts at 1
      productSCServicesIndexedByID: [{}],
      productDetails: []
    }
    this.getPublishedProductDetails = this.getPublishedProductDetails.bind(this);
    // this.registerUser = this.registerUser.bind(this);
    // this.publishProduct = this.publishProduct.bind(this);
    //this.getProductDetails = this.getProductDetails.bind(this);
    this.postUserRating = this.postUserRating.bind(this);
    this.getUserAccountDetails = this.getUserAccountDetails.bind(this);
    this.loadContract = this.loadContract.bind(this);
    this.getInvestorsToBePaidOutInfo = this.getInvestorsToBePaidOutInfo.bind(this);
    this.attachToWalletProvider = this.attachToWalletProvider.bind(this);

    this.dumpState = this.dumpState.bind(this);
    this.useMachineExHelper = this.useMachineExHelper.bind(this);
    //this.notify = this.notify.bind(this);
  }


  async componentDidMount() {

    // this returns the provider, or null if it wasn't detected
    let walletDidAttach = await this.attachToWalletProvider();
    if (walletDidAttach) {

      await this.loadBlockchainData();
      this.setState({ loading: true });
      this.setState({ productDetails: await this.getPublishedProductDetails() });
      await this.getUserAccountDetails();
      this.setState({ loading: false });
    }
  }


  async attachToWalletProvider() {
    const provider = await detectEthereumProvider();

    if (provider) {

      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');

        toaster.notify('Do you have multiple wallets installed?', {
          position: 'top-right',
        });
        return false;
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

        return true;
      }

    } else {
      toaster.notify('Please install MetaMask', {
        position: 'top-right',
      });
      console.log('Please install MetaMask');
      window.location.assign("https://metamask.io/");
      return false;
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

    if (Utility.Web3 === undefined) {
      Utility.Web3 = new Web3(window.ethereum);
      console.log("Web3 loaded");

    }
    return Utility.Web3;
  }

  async loadBlockchainData() {
    await this.loadWeb3();
    const accounts = await Utility.Web3.eth.getAccounts();
    if (typeof accounts === undefined || accounts.length === 0) {
      console.log('No metamask account loaded.');
      toaster.notify('No metamask account loaded.', {
        position: 'top-right',
      });
    } else {
      this.setState({ account: accounts[0] });
      const networkId = await Utility.Web3.eth.net.getId();

      await this.configureContracts(networkId);
    }
    this.setState({ loading: false });
  }

  async configureContracts(networkId) {

    // Get registerUserHub contract details
    const registerUserHubNetworkData = RegisterUserHubContract.networks[networkId];
    if (registerUserHubNetworkData) {
      Utility.RegisterUserHubContractAddress = registerUserHubNetworkData.address;
      //console.log("RegisterUserHub contract loaded:" + Utility.RegisterUserHubContractAddress);
      Utility.RegisterUserHubContract = await this.loadContract(RegisterUserHubContract, Utility.RegisterUserHubContractAddress);


    } else {
      toaster.notify('RegisterUserHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('RegisterUserHub contract not deployed to detected network');
    }


    // Get StandardProduct contract details
    const productHubNetworkData = ProductHub.networks[networkId];
    if (productHubNetworkData) {
      Utility.ProductHubContractAddress = productHubNetworkData.address;
      //console.log("ProductHub contract loaded:" + Utility.ProductHubContractAddress);
      Utility.ProductHubContract = await this.loadContract(ProductHub, Utility.ProductHubContractAddress);
    } else {
      toaster.notify('ProductHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('ProductHub contract not deployed to detected network');
    }

    // Get SupplychainHub contract details
    const supplychainHubNetworkData = SupplychainHub.networks[networkId];
    if (supplychainHubNetworkData) {
      Utility.SupplychainHubContractAddress = supplychainHubNetworkData.address;
      //console.log("SupplychainHub contract loaded:" + Utility.SupplychainHubContractAddress);
      Utility.SupplychainHubContract = await this.loadContract(SupplychainHub, Utility.SupplychainHubContractAddress);

    } else {
      toaster.notify('SupplychainHub contract not deployed to detected network', {
        position: 'top-right',
      });
      console.log('SupplychainHub contract not deployed to detected network');
    }
  }

  async loadContract(contractBytecode, contractAddress) {
    await this.loadWeb3();
    const contract = new Utility.Web3.eth.Contract(contractBytecode.abi, contractAddress);
    return contract;
    //console.log("App state");
    //console.log(this.state);
  }

  async getUserAccountDetails() {

    if (Utility.RegisterUserHubContract !== undefined && Utility.RegisterUserHubContract !== '') {
      const isUserRegistered = await Utility.RegisterUserHubContract.methods.isRegistered().call({ from: this.state.account });
      if (isUserRegistered) {
        const userRole = await Utility.RegisterUserHubContract.methods.getUserRole().call({ from: this.state.account });
        const userName = await Utility.RegisterUserHubContract.methods.getUserName().call({ from: this.state.account });
        //console.log("Get username of call:" + await Utility.RegisterUserHubContract.methods.getUserNameOf(this.state.account).call({ from: this.state.account }));
        this.setState({
          'userRole': NumToUserRole[userRole],
          'userName': userName
        });
        //console.log("userRole:" + this.state.userRole);
      }

      this.setState({
        'isUserRegistered': isUserRegistered
      });
      //console.log("Is User Registered:" + isUserRegistered + " " + this.state.account);
    }
  }

  async getPublishedProductDetails() {
    const web3 = Utility.Web3;
    var data = [];
    if (Utility.ProductHubContract !== undefined && Utility.ProductHubContract !== '') {
      const productIDCounterInclusive = await Utility.ProductHubContract.methods.upc().call({
        from: this.state.account
      });
      console.log("productIDCounterInclusive", productIDCounterInclusive);

      for (var productID = 1; productID < productIDCounterInclusive; ++productID) {
        const productDetail = await Utility.ProductHubContract.methods
          .getproduce(productID)
          .call({ from: this.state.account });
        const accountUserName = await Utility.RegisterUserHubContract.methods
          .getUserNameOf(productDetail[6])
          .call({ from: this.state.account });
        const accountUserRating = await Utility.RegisterUserHubContract.methods
          .getUserRating(productDetail[6])
          .call({ from: this.state.account });
        const productSupplychainStatusOrdinal = await Utility.SupplychainHubContract.methods
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
        productInfo.investorsToBePaidOut = await this.getInvestorsToBePaidOutInfo(productID);

        //productDetail[productDetail.length] = accountUserName;
        //Spawn FSM to track this product supplychain state
        productInfo.machineMetadata = await this.createMachine(productInfo.universalProductCode, productInfo);

        // this.context.send({ type: 'NEW_SC_FSM.ADD', upc: productDetail[0] });
        // this.context.send({ type: 'SET_CONTEXT', data: data[productID - 1], actorID: 'scfsm-' + productDetail[0] });
        console.log('Machine state & control object', productInfo.machineMetadata);
        data.push(productInfo);
      }
      console.log("Product Details", data);

      const balance = await Utility.ProductHubContract.methods
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
    const registerUserHubContract = new this.state.web3.eth.Contract(ProductHub.abi, this.state.productHubContractAddress);
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



  async getInvestorsToBePaidOutInfo(upc) {
    this.setState({ loading: true });

    const productHubContract = new Utility.Web3.eth.Contract(ProductHub.abi, Utility.ProductHubContractAddress);

    let numInvestors = await productHubContract.methods.getNumberOfInvestorsForAProduct(Number(upc)).call({
      from: this.state.account
    });
    //console.log('numInvestors',numInvestors);

    let data = [];
    for (var i = 0; i < numInvestors; ++i) {
      let productContributor = await productHubContract.methods.getContributorFromListForAProduct(Number(upc), i).call({
        from: this.state.account
      });

      var dueAmount = await productHubContract.methods
        .getPayoutAmountForContributorToAProduct(upc, productContributor)
        .call({ from: this.state.account });
      var username = await Utility.RegisterUserHubContract.methods
        .getUserNameOf(productContributor)
        .call({ from: this.state.account });
      if (dueAmount > 0) {
        data.push({ name: username, account: productContributor, dueAmount: dueAmount });
      }

    }
    return data;
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
      console.groupEnd();
    }
  }

  async componentWillUnmount() {
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
          <ProductListing postUserRating={this.postUserRating} data={this.state.productDetails} account={this.state.account} userRole={this.state.userRole} {...this.state}
          />
        )
      } else {
        return (

          (< Register
            account={this.state.account}
          />)
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