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
        const productContractAddress = props.record.productContractAddress;
        console.log("In renderer")
        

        var enableCrowdFundFeature = false;

        if ((userRole !== 'Farmer') && (props.record.fundingStage === '0')) { //is not Farmer and fundingStage open
            //Enable crowd fund feature
            enableCrowdFundFeature = true;
        }

        console.log("Should Enable crowd fund contribution:"+enableCrowdFundFeature);

        return (
            <span>
                {enableCrowdFundFeature ? (<form onSubmit={(event) => {
                    event.preventDefault();
                    console.log("on submit", this.inputNode.value, event);
                    fundProduct(productContractAddress, event.target.elements[0].value);
                }}>

                    <input
                        id={"amount" + props.record.upc}
                        type='text'
                        ref={(input) => { this.inputNode = input }}
                        className='form-control'
                        placeholder='Contribute funds (in Wei)'
                        required />
                    <br />

                    {/* <button onClick={(event) => { fundCompLoader(props.record.upc) }}>Deposit Fund</button> */}
                    <button type='submit' className='btn btn-primary'>Deposit Fund</button>
                </form>) : null}

            </span>
        );
    }
}