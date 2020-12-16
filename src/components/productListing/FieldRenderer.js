import React from 'react';
import { UserRoleToNum } from '../Constants';
import ReactStars from "react-rating-stars-component";


//import { NumToUserRole } from '../Constants';
// https://www.npmjs.com/package/react-filterable-table
// https://github.com/ianwitherow/react-filterable-table/blob/master/example-alt/js/FieldRenders.js
export default {
    pendingActionLink: function (props) {
        let fields = props.fields;
        /**
         * console.log("props");
         * console.log(props);
         * console.log("fields");
         * console.log(fields);
         * console.log("fields.props");
         * console.log(fields.props);
         * */
        //let fundProduct = fields[fields.length - 1].props.fundProduct;
        const userRole = fields[fields.length - 1].props.userRole;
        const scfsmList = fields[fields.length - 1].props.productSCServicesIndexedByID
        // const productContractAddress = props.record.productContractAddress;
        const productID = props.record.universalProductCode;
        const senderAccount = fields[fields.length - 1].props.account;
        //const receiverAccount = props.record.ownerAccount;
        console.log("In renderer", "Role", userRole)
        console.log("Props", fields[fields.length - 1].props);
        var enableCrowdFundFeature = false;

        const scfsm = scfsmList[productID];

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
                    let scFSMEvent = {
                        type:'FUND',
                        payload:{
                            userRoleType:UserRoleToNum[userRole],
                            sender:senderAccount,
                            contributionAmount:contributionAmount
                        }
                    };
                    scfsm.send(scFSMEvent);
                    //fundProduct(receiverAccount, contributionAmount, UserRoleToNum[userRole], productID);
                }}>

                    <input
                        id={"amount" + props.record.universalProductCode}
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
    },
    userRating: function (props) {

        const val = getVal();
        function ratingChanged() {

        }
        function getVal() {
            return (Math.random() * Math.floor(6));
        }
        return (
            <ReactStars
                count={5}
                onChange={ratingChanged}
                value={val}
                size={15}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
            />);
    }
}