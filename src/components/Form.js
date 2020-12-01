import React, { Component } from 'react';

class Form extends Component {

  render() {
    return (
      <div id='content'>
        <h1>Publish Product</h1>
        <p>Published product will be tracked for crowd funding</p>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.publishProduct({
            upc: this.upc.value,
            productPrice: this.productPrice.value,
            account: this.props.account,
            originFarmName: this.originFarmName.value,
            originFarmInfo: this.originFarmInfo.value,
            originFarmLat: this.originFarmLat.value,
            originFarmLong: this.originFarmLong.value,
            productNotes: this.productNotes.value,
            fundingCap:this.fundingCap,
            deadline:this.deadline
          })
        }}>
          <div className='form-group mr-sm-2'>
            <input
              id='upc'
              type='text'
              ref={(input) => { this.upc = input }}
              className='form-control'
              placeholder='Universal Product Code e.g. 1'
              required />
            {/* <br/>
              <input
              id='sku'
              type='text'
              ref={(input) => { this.sku = input }}
              className='form-control'
              placeholder='Stock Keeping Unit'
              required /> */}
            <br />
            <input
              id='productPrice'
              type='text'
              ref={(input) => { this.productPrice = input }}
              className='form-control'
              placeholder='Price in Ethers'
              required />
              <br />
            <input
              id='fundingCap'
              type='text'
              ref={(input) => { this.fundingCap = input }}
              className='form-control'
              placeholder='Funding Cap (in Ethers)'
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
              id='originFarmInfo'
              type='text'
              ref={(input) => { this.originFarmInfo = input }}
              className='form-control'
              placeholder='Origin Farm Info' />
            <br />
            <input
              id='originFarmLat'
              type='text'
              ref={(input) => { this.originFarmLat = input }}
              className='form-control'
              placeholder='Origin Farm Latitude'
            />
            <br />
            <input
              id='originFarmLong'
              type='text'
              ref={(input) => { this.originFarmLong = input }}
              className='form-control'
              placeholder='Origin Farm Longitude'
            />
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

export default Form;