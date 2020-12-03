import React, { Component } from 'react';
import {UserRoleToNum} from './Constants';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = { value: UserRoleToNum.FarmerRole };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.registerUser(this.state.value);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Register as:
              <select value={this.state.value} onChange={this.handleChange}>
                        <option value={UserRoleToNum.FarmerRole}>Farmer</option>
                        <option value={UserRoleToNum.DonorRole}>Donor</option>
                        <option value={UserRoleToNum.InvestorRole}>Investor</option>
                        <option value={UserRoleToNum.SpotMarketConsumerRole}>Spot Market Consumer</option>
                        <option value={UserRoleToNum.ForwardMarketConsumerRole}>Forward Market Consumer</option>
                    </select>
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
export default Register