import React, { Component } from 'react';
import '../../css/ProductListing.css';
import '../../common/Utility';
import Utility from '../../common/Utility';
class PublishProductForm extends Component {

  constructor(props) {
    super(props);
    this.state = { 'loading': false };
    this.publishProduct = this.publishProduct.bind(this);
  }

  async publishProduct(args) {
    this.setState({ loading: true });
    const web3 = Utility.Web3;
    console.log(args, web3.utils.asciiToHex(args.cropName),
      parseInt(args.quantity),
      parseInt(args.expectedPrice),
      parseInt(args.requiredFunding)
    );
    Utility.ProductHubContract.methods.produce(
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
      from: this.props.account,
      gas: 2000000
    }).on('receipt', async (receipt) => {
      console.log(receipt);
      this.props.closePublishView();
      this.setState({ loading: false });
    }).on('error', function (error, receipt) {
      console.log(error);
      console.log(receipt);
      this.setState({ loading: false });
    });
  }

  render() {

    if (this.state.loading) {
      return (
        <div id='loader' className='text-center'>
          <p className='text-center'>Loading...</p>
        </div>
      )
    } else {
      return (<div id='content' className='centered'>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.publishProduct({
            cropName: this.cropName.value,
            quantity: this.quantity.value,
            expectedPrice: this.expectedPrice.value,
            requiredFunding: this.requiredFunding.value,
            ownerAccount: this.props.account,
            // sku: this.sku.value,
            // productPrice: this.productPrice.value,
            // account: this.props.account,
            // // originFarmName: this.originFarmName.value,
            // // productNotes: this.productNotes.value,
            // fundingCap: this.fundingCap.value,
            // deadline: parseInt(this.deadline.value) * 24 * 3600
          })
        }}>

          <h1 >Publish Product</h1>
          <p>Published product will be tracked for crowd funding</p>
          <div>

            <input
              id='cropName'
              type='text'
              ref={(input) => { this.cropName = input }}
              className='form-control'
              placeholder='Crop Name'
              required />
            <br />
            <input
              id='quantity'
              type='text'
              ref={(input) => { this.quantity = input }}
              className='form-control'
              placeholder='Quantity'
              required />
            <br />
            <input
              id='expectedPrice'
              type='text'
              ref={(input) => { this.expectedPrice = input }}
              className='form-control'
              placeholder='Expected Product Price in Wei'
              required />
            <br />

            <input
              id='requiredFunding'
              type='text'
              ref={(input) => { this.requiredFunding = input }}
              className='form-control'
              placeholder='Required funding amount in Wei'
              required />
            <br />
            <input
              id='ownerAccount'
              type='text'
              ref={(input) => { this.ownerAccount = input }}
              className='form-control'
              value={this.props.account}
              readOnly />
            {/* <input
              id='sku'
              type='text'
              ref={(input) => { this.sku = input }}
              className='form-control'
              placeholder='Stock Keeping Unit size'
              required />
            <br /> */}
            {/* 
            <input
              id='fundingCap'
              type='text'
              ref={(input) => { this.fundingCap = input }}
              className='form-control'
              placeholder='Funding Cap (in Wei)'
              required />
            <br />
            <input
              id='deadline'
              type='text'
              ref={(input) => { this.deadline = input }}
              className='form-control'
              placeholder='Crowdfunding Deadline from now (in days)'
              required />
            {/* <br />
            <input
              id='originFarmName'
              type='text'
              ref={(input) => { this.originFarmName = input }}
              className='form-control'
              placeholder='Origin Farm Name'
              required />
            <br />
            <input
              id='productNotes'
              type='text'
              ref={(input) => { this.productNotes = input }}
              className='form-control'
              placeholder='Product Notes'
            /> */}
          </div>
          <br />
          <br />
          <button type='submit' className='btn btn-primary'>Publish Product</button>&nbsp;&nbsp;<button onClick={(event) => { this.props.closePublishView() }} className='btn btn-danger'>Cancel</button>
        </form>
      </div>
      );
    }
  }
}

export default PublishProductForm;