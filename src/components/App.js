//import StandardFundingHub from '../artifacts/StandardFundingHub';
//import FundingToken from '../artifacts/FundingToken';
import SupplychainHub from '../artifacts/SupplychainHub';
import StructStorage from '../artifacts/StructStorage';
import StandardRegisterUserHub from '../artifacts/StandardRegisterUserHub';
import React, { Component } from 'react';
import Navbar from './Navbar';
import Register from './Register';
import Web3 from 'web3';
import './App.css';
//import Routes from './Routes.js';
import ProductListing from './productListing/ProductListing';
import { NumToUserRole, OrdinalToSupplyChainStatus } from './Constants';
import Utility from '../common/Utility';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';

import { MainContext } from './MainContext';
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
      productSCServicesIndexedByID: [{}],
      zeroAddr: '0x0000000000000000000000000000000000000000'
    }
    this.getPublishedProductDetails = this.getPublishedProductDetails.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.publishProduct = this.publishProduct.bind(this);
    //this.getProductDetails = this.getProductDetails.bind(this);
    this.fundProduct = this.fundProduct.bind(this);
    this.getUserAccountDetails = this.getUserAccountDetails.bind(this);
    this.loadContract = this.loadContract.bind(this);


    this.dumpState = this.dumpState.bind(this);
    this.useMachineExHelper = this.useMachineExHelper.bind(this);
    //this.notify = this.notify.bind(this);
  }


  async componentDidMount() {
    if (window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      Utility.Web3 = await this.loadWeb3();
      await this.loadBlockchainData();

      //console.log('MainContext', this.context);


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
    if (typeof window.ethereum !== undefined) {

      if (this.state.web3 === undefined) {
        const web3 = new Web3(window.ethereum);
        this.setState({ web3: web3 });
        console.log("Web3 loaded");
        return web3;
      } else {
        return this.state.web3;
      }

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
      const structStorageNetworkData = StructStorage.networks[networkId];
      if (structStorageNetworkData) {
        this.setState({
          'structStorageContractAddress': structStorageNetworkData.address
        });
        Utility.StructStorageContractAddress = structStorageNetworkData.address;
        console.log("StructStorage contract loaded:" + this.state.structStorageContractAddress);
        await this.loadContract(StructStorage, this.state.structStorageContractAddress, 'structStorageContract');
        Utility.StructStorageContract = this.state.structStorageContract;
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
    this.setState({ loading: false });
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

      const balance = await this.state.structStorageContract.methods
        .getBalance(this.state.account)
        .call({ from: this.state.account });
      this.setState({ userBalance: balance });
      console.log(this.state.account + ":balance-" + balance);

    } else {

      toaster.notify('structStorageContract not loaded', {
        position: 'top-right',
      });
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
            {this.renderContent()}
            {/* <Routes></Routes> */}
          </div>
        </div>
      </div>
    );
  }
}

App.contextType = MainContext;
export default App;