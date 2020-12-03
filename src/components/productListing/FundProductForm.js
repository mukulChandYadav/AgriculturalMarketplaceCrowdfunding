import React, { Component } from 'react';


class FundProductForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    this.props.publishProduct({
                        sku: this.sku.value,
                        productPrice: this.productPrice.value,
                        account: this.props.account,
                        originFarmName: this.originFarmName.value,
                        productNotes: this.productNotes.value,
                        fundingCap: this.fundingCap.value,
                        deadline: this.deadline.value
                    })
                }}>
                    <div className='form-group mr-sm-2'>
                        <input
                            id='amount'
                            type='text'
                            ref={(input) => { this.amount = input }}
                            className='form-control'
                            placeholder='Contribute funds (in Wei)'
                            required />
                        <br />
                    </div>
                </form>

                <label></label>

            </div>
        )
    }
}
export default FundProductForm;