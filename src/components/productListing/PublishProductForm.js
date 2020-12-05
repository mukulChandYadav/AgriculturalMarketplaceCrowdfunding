import React, { Component } from 'react';

class PublishProductForm extends Component {

  render() {
    return (
      <div id='content'>
        <h1>Publish Product</h1>
        <p>Published product will be tracked for crowd funding</p>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.publishProduct({
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
          <div className='form-group mr-sm-2'>

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
          <button type='submit' className='btn btn-primary'>Publish Product</button>
        </form>
      </div>
    );
  }
}

export default PublishProductForm;