import React from 'react';

//import { NumToUserRole } from '../Constants';
// https://www.npmjs.com/package/react-filterable-table
// https://github.com/ianwitherow/react-filterable-table/blob/master/example-alt/js/FieldRenders.js
export default {
    productFundingPageLink: function (props) {
        //;
        let fields = props.fields;
        console.log("props");
        console.log(props);
        console.log("fields");
        console.log(fields);
        console.log("fields.props");
        console.log(fields.props);
        let fundProduct = fields[fields.length - 1].props.fundProduct;
        const userRole = fields[fields.length - 1].props.userRole;
        // const productContractAddress = props.record.productContractAddress;
        const productID = props.record.universalProductCode;
        const senderAccount = fields[fields.length - 1].props.account;
        const receiverAccount = props.record.ownerAccount;
        console.log("In renderer", "Role", userRole)

        var enableCrowdFundFeature = false;

        if ((userRole !== 'Farmer') && (parseInt(props.record.requiredFunding) !== 0)) {
            //is not Farmer and fundingStage open
            //Enable crowd fund feature
            enableCrowdFundFeature = true;
        }

        console.log("Should Enable crowd fund contribution:" + enableCrowdFundFeature);

        return (
            <span>
                {enableCrowdFundFeature ? (<form onSubmit={(event) => {
                    event.preventDefault();
                    console.log("on submit", this.inputNode.value, event);
                    const contributionAmount = event.target.elements[0].value;
                    fundProduct(receiverAccount, contributionAmount, senderAccount, productID);
                }}>

                    <input
                        id={"amount" + props.record.upc}
                        type='text'
                        ref={(input) => { this.inputNode = input }}
                        className='form-control'
                        placeholder='Amount (in Wei)'
                        required />
                    <br />

                    {/* <button onClick={(event) => { fundCompLoader(props.record.upc) }}>Deposit Fund</button> */}
                    <button type='submit' variant="primary" className='btn btn-primary' size="sm">Contribute</button>
                </form>) : (parseInt(props.record.requiredFunding) === 0) ? (<button disabled className='btn btn-success'>Funded</button>) : null}

            </span>
        );
    }
}