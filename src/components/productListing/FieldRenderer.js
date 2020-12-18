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
        const receiverAccount = props.record.ownerAccount;
        const availableFunding = props.record.availableFunding;
        const expectedPrice = props.record.expectedPrice;
        console.log("In renderer", "Role", userRole)
        console.log("Props", fields[fields.length - 1].props);
        const scfsm = scfsmList[productID];
        var scfsmState = scfsm.state.value;
        var nextActionButtonValue = '';
        var isInputDisabled = true;
        var buttonDisabled = true;


        var formSubmitAction;
        switch (scfsmState) {
            case 'sold':
                nextActionButtonValue = 'Sold';
                buttonDisabled = 'true';
                break;
            case 'onSale':
                nextActionButtonValue = 'Buy';
                isInputDisabled = true;
                if (userRole === 'Spot Market Consumer') {
                    buttonDisabled = '';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'SALE_TO_CUSTOMER',
                            payload: {
                                sender: senderAccount,
                                expectedPrice: expectedPrice,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }

                } else {
                    buttonDisabled = true;
                }

                break;
            case 'harvested':
                nextActionButtonValue = 'Transfer To Marketplace';
                isInputDisabled = true;
                if (userRole === 'Farmer') {
                    buttonDisabled = '';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'PUT_ON_SALE',
                            payload: {
                                sender: senderAccount,
                                expectedPrice: expectedPrice,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }

                } else {
                    buttonDisabled = true;
                }

                break;
            case 'funded':
                nextActionButtonValue = 'Harvest';
                isInputDisabled = true;
                if (userRole === 'Farmer') {
                    buttonDisabled = '';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'PRODUCT_HARVEST',
                            payload: {
                                sender: senderAccount,
                                availableFunds: availableFunding,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }

                } else {
                    buttonDisabled = true;
                }

                break;
            case 'productPublished':
                nextActionButtonValue = 'Contribute';
                if (userRole === 'Investor' || userRole === 'Donor') {
                    isInputDisabled = '';
                    buttonDisabled = '';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        const contributionAmount = event.target.elements[0].value;
                        let scFSMEvent = {
                            type: 'FUND',
                            payload: {
                                userRoleType: UserRoleToNum[userRole],
                                sender: senderAccount,
                                contributionAmount: contributionAmount,
                                receiverAccount: receiverAccount
                            }
                        };
                        scfsm.send(scFSMEvent);
                    }
                }


                break;
            default:
                console.error("Product in unknown fsm stage");
                break;
        }

        return (
            <span>
                <form name={productID} onSubmit={formSubmitAction}>

                    <input
                        disabled={isInputDisabled}
                        hidden={isInputDisabled}
                        id={"amount" + props.record.universalProductCode}
                        type='text'
                        ref={(input) => { this.inputNode = input }}
                        className='form-control'
                        placeholder='Amount (in Wei)'
                        required />
                    <br />
                    <button type='submit' disabled={buttonDisabled} variant="primary" className='btn btn-primary' size="sm" >{nextActionButtonValue}</button>
                </form>
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