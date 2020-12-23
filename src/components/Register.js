import React, { Component } from 'react';
import { UserRoleToNum } from './Constants';
import Utility from '../common/Utility';

class Register extends Component {

    constructor(props) {
        super(props);
        this.registerUser = this.registerUser.bind(this);
    }


    async registerUser(userName, userRoleType) {
        this.setState({ loading: true });
        Utility.RegisterUserHubContract.methods.registerUser(userName, userRoleType)
            .send({
                from: this.props.account
            }).on('receipt', async (receipt) => {
                //await this.loadSupplychainHub()
                this.setState({ loading: false });
                console.log(receipt);
                // TODO: Fix
                window.location.reload();
            }).on('error', function (error, receipt) {
                console.log(error);
                console.log(receipt);
                window.location.reload();
                //this.setState({ loading: false });
            });
    }

    render() {
        return (

            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    this.registerUser(this.userName.value, this.userRole.value)
                }}>
                    <br />
                    <br />

                    <br />
                    <br />

                    <br />
                    <br />

                    <br />
                    <br />

                    <br />
                    <br />

                    <p>Welcome to portal for Decentralized crowdfunding of Agricultural Marketplace products</p>

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

                    <input type="submit" value="Register" className='btn btn-primary' />

                </form>
            </div>
        );
    }
}
export default Register
