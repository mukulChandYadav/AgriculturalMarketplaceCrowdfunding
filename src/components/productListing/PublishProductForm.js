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
            sku: this.sku.value,
            productPrice: this.productPrice.value,
            account: this.props.account,
            originFarmName: this.originFarmName.value,
            productNotes: this.productNotes.value,
            fundingCap:this.fundingCap.value,
            deadline:this.deadline.value
          })
        }}>
          <div className='form-group mr-sm-2'>
            <input
              id='sku'
              type='text'
              ref={(input) => { this.sku = input }}
              className='form-control'
              placeholder='Stock Keeping Unit size'
              required />
            <br />
            <input
              id='productPrice'
              type='text'
              ref={(input) => { this.productPrice = input }}
              className='form-control'
              placeholder='Price in Wei'
              required />
              <br />
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
            <br />
            <input
              id='originFarmerID'
              type='text'
              ref={(input) => { this.originFarmerID = input }}
              className='form-control'
              value={this.props.account}
              readOnly />
            <br />
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
            />
          </div>
          <button type='submit' className='btn btn-primary'>Publish Product</button>
        </form>
      </div>
    );
  }
}

export default PublishProductForm;