import React, { Component } from 'react';


class InvestorPayoutSelector {


    // constructor(props) {
    //     super(props);
    //     this.state = {

    //     };

    //     this.renderInvestorOptions = this.renderInvestorOptions.bind(this);
    //     this.selectInvestor = this.selectInvestor.bind(this);
    // }

    

    

    render() {
        return (<div id='content' className='centered'>
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.payoutInvestor(
                    this.props.upc,
                    this.state.investorAccount
                )
            }}>
                <div className='form-group mr-sm-2' >

                    {/* <h3>Payout Product Investors</h3> */}
                    <div className="form-group">
                        <label htmlFor='upc'>Universal Product Code</label>
                        <input
                            id='upc'
                            type='text'
                            className='form-control'
                            value={this.props.upc}
                            readOnly />
                    </div>

                    <div className="form-group">
                        <label htmlFor="selectButton"> Select Investor to be paid  out:</label>
                        <select id="selectButton" onChange={this.props.selectInvestor}>
                            {this.renderInvestorOptions()}
                        </select>
                    </div>

                    <div className="form-group" >
                        <label htmlFor='investorName' >Investor Name</label>
                        <input
                            id='investorName'
                            type='text'
                            className='form-control'
                            value={this.state.investorName}
                            readOnly />
                    </div>

                    <div className="form-group" >
                        <label htmlFor='investorAccount' >Investor Account</label>
                        <input
                            id='investorAccount'
                            type='text'
                            className='form-control'
                            value={this.state.investorAccount}
                            readOnly />
                    </div>

                    <div className="form-group">
                        <label htmlFor='investorDueAmount'>Due Amount(in Wei)</label>
                        <input
                            id='investorDueAmount'
                            type='text'
                            className='form-control'
                            value={this.state.investorDueAmount}
                            readOnly /></div>
                </div>
                {/* <button type='submit' className='btn btn-primary'>Transfer funds to Investor</button> */}
        {/* &nbsp;&nbsp;
        <button onClick={(event) => { event.preventDefault(); this.props.toggleViewHandler(); }} className='btn btn-danger'>Cancel</button> */}
            </form>
        </div>
        );
    }
}

export default InvestorPayoutSelector;