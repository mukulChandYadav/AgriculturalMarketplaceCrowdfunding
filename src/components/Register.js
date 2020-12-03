import React, { Component } from 'react';
import { UserRoleToNum } from './Constants';


class Register extends Component {

    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.registerUser(this.userName.value, this.userRole.value)
              }}>

                <p>Welcome to portal for Decentralized crowdfunding of Agricultural Marketplace products.
                This portal leverages Ethereum based smart contract infrastructure to facilitate Agro-based product
                funding and supplychain management procedures in the form of a DApp</p>

                <input
                    id='userName'
                    type='text'
                    ref={(input) => { this.userName = input }}
                    className='form-control'
                    placeholder='Name of account holder'
                    required />
                <label htmlFor="selectButton"> Register as:</label>
                <select id="selectButton" ref={(input) => { this.userRole = input }}>
                    <option value={UserRoleToNum.FarmerRole}>Farmer</option>
                    <option value={UserRoleToNum.DonorRole}>Donor</option>
                    <option value={UserRoleToNum.InvestorRole}>Investor</option>
                    <option value={UserRoleToNum.SpotMarketConsumerRole}>Spot Market Consumer</option>
                    <option value={UserRoleToNum.ForwardMarketConsumerRole}>Forward Market Consumer</option>
                </select>

                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default Register