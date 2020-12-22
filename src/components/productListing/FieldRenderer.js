import React from 'react';
import { UserRoleToNum } from '../Constants';
import ReactStars from "react-rating-stars-component";
//import InvestorPayoutSelector from './InvestorPayoutSelector';


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
        const scfsmList = fields[fields.length - 1].props.productSCServicesIndexedByID;
        // const productContractAddress = props.record.productContractAddress;
        const productID = props.record.universalProductCode;
        const activeUserAccount = fields[fields.length - 1].props.account;
        const productCurrentOwnerAccount = props.record.ownerAccount;
        const availableFunding = props.record.availableFunding;
        const expectedPrice = props.record.expectedPrice;
        console.log("In renderer", "Role", userRole)
        console.log("Props", fields[fields.length - 1].props);
        const scfsm = scfsmList[productID];
        const investors = scfsm.state.context.investorsToBePaidOut;
        console.log('Investors for ', productID, investors);
        var scfsmState = scfsm.state.value;
        var nextActionButtonValue = '';
        var isInputDisabled = true;
        var buttonDisabled = true;
        var submitButtonVariant = 'btn btn-secondary';
        var toolTipPendingActionText = "Pending action for Product Owner";
        var investorSelectorDisabled = true;
        var selectedInvestorAccount = '';
        var payoutAmount = 0;
        const selectedInvestorAccountLabelID = 'selectedInvestorAccount' + productID;
        const selectedInvestorNameLabelID = 'selectedInvestorName' + productID;
        const selectedInvestorDueAmountLabelID = 'selectedInvestorDueAmount' + productID;
        const submitButtonID = 'submitButton' + productID;

        var investorPayoutOptionSelected = false;
        var formSubmitAction;

        switch (scfsmState) {
            case 'settled':
                nextActionButtonValue = 'Settled';
                buttonDisabled = true;
                submitButtonVariant = 'btn btn-success';
                toolTipPendingActionText = 'Product supplychain settled';
                investorSelectorDisabled = true;
                break;
            case 'pendingInvestorSettlement':
                nextActionButtonValue = 'Payout Investors';
                buttonDisabled = true;
                toolTipPendingActionText = 'Waiting for Marketplace Manager to settle payouts';
                if (userRole === 'Marketplace Manager') {

                    investorSelectorDisabled = false;
                    submitButtonVariant = 'btn btn-primary';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'PAYOUT_INVESTOR',
                            payload: {
                                sender: activeUserAccount,
                                investorAccount: selectedInvestorAccount,
                                payoutAmount: payoutAmount,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }
                }
                break;
            case 'onSale':
                nextActionButtonValue = 'Buy';
                isInputDisabled = true;
                toolTipPendingActionText = 'Waiting for Customer';
                if (userRole === 'Spot Market Consumer') {
                    buttonDisabled = '';
                    submitButtonVariant = 'btn btn-primary';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'SALE_TO_CUSTOMER',
                            payload: {
                                sender: activeUserAccount,
                                expectedPrice: expectedPrice,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }

                } else {
                    buttonDisabled = true;
                    submitButtonVariant = 'btn btn-secondary';
                }

                break;
            case 'harvested':
                nextActionButtonValue = 'Transfer To Marketplace';
                isInputDisabled = true;
                toolTipPendingActionText = "Waiting for Marketplace Manager's approval";
                if ((userRole === 'Marketplace Manager')) {
                    buttonDisabled = '';
                    submitButtonVariant = 'btn btn-primary';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'PUT_ON_SALE',
                            payload: {
                                sender: activeUserAccount,
                                expectedPrice: expectedPrice,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }

                } else {
                    buttonDisabled = true;
                    submitButtonVariant = 'btn btn-secondary';
                }

                break;
            case 'funded':
                nextActionButtonValue = 'Harvest';
                isInputDisabled = true;
                toolTipPendingActionText = "Waiting for farmer to harvest product";
                if ((userRole === 'Farmer') && (activeUserAccount === productCurrentOwnerAccount)) {
                    buttonDisabled = '';
                    submitButtonVariant = 'btn btn-primary';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        let scFSMEvent = {
                            type: 'PRODUCT_HARVEST',
                            payload: {
                                sender: activeUserAccount,
                                availableFunds: availableFunding,
                            }
                        };
                        console.log('Invoked FSM', scfsm, 'with event', scFSMEvent);
                        scfsm.send(scFSMEvent);
                    }
                } else {
                    buttonDisabled = true;
                    submitButtonVariant = 'btn btn-secondary';
                }

                break;
            case 'productPublished':
                nextActionButtonValue = 'Contribute';
                toolTipPendingActionText = "Waiting for funding by Investors, Donors & Forward Market Consumer";
                if (userRole === 'Investor' || userRole === 'Donor') {
                    isInputDisabled = '';
                    buttonDisabled = '';
                    submitButtonVariant = 'btn btn-primary';
                    formSubmitAction = function (event) {
                        event.preventDefault();
                        const contributionAmount = event.target.elements[0].value;
                        let scFSMEvent = {
                            type: 'FUND',
                            payload: {
                                userRoleType: UserRoleToNum[userRole],
                                sender: activeUserAccount,
                                contributionAmount: contributionAmount,
                                receiverAccount: productCurrentOwnerAccount
                            }
                        };
                        scfsm.send(scFSMEvent);
                    }
                } else {
                    buttonDisabled = true;
                    submitButtonVariant = 'btn btn-secondary';
                }
                break;
            default:
                console.error("Product in unknown fsm stage");
                break;
        }

        const selectInvestor = (event) => {
            console.log(event.target);
            investorPayoutOptionSelected = event.target.value.split('-').length > 1;
            if (investorPayoutOptionSelected) {
                document.getElementById(selectedInvestorNameLabelID).value = event.target.value.split('-')[0];
                selectedInvestorAccount = document.getElementById(selectedInvestorAccountLabelID).value = event.target.value.split('-')[1];
                payoutAmount = document.getElementById(selectedInvestorDueAmountLabelID).value = event.target.value.split('-')[2];
                document.getElementById(submitButtonID).disabled = false;
                console.log('Selected Invester-', document.getElementById(selectedInvestorNameLabelID).value, selectedInvestorAccount);
            } else {
                document.getElementById(selectedInvestorNameLabelID).value = '';
                selectedInvestorAccount = document.getElementById(selectedInvestorAccountLabelID).value = '';
                payoutAmount = document.getElementById(selectedInvestorDueAmountLabelID).value = '';
                document.getElementById(submitButtonID).disabled = true;
            }
        }
        const renderInvestorOptions = () => {
            //const { investors: investors  = this.props;
            return (
                investors &&
                investors.length > 0 &&
                investors.map((investor, index) => {
                    return <option value={investor.name + '-' + investor.account + '-' + investor.dueAmount}>{investor.name + '-' + investor.account}</option>;
                })
            );
        }

        return (
            <span>
                <form name={productID} onSubmit={formSubmitAction}>

                    {!investorSelectorDisabled ? (
                        <div className='form-group mr-sm-2' >


                            <div className="form-group">

                                <select id="selectButton" onChange={selectInvestor}>
                                    <option value=''>Select Investor for Payout</option>
                                    {renderInvestorOptions()}
                                </select>
                            </div>

                            <div className="form-group" >
                                <input
                                    id={'selectedInvestorName' + productID}
                                    type='text'
                                    className='form-control'
                                    placeholder='Investor Name'
                                    readOnly />
                            </div>

                            <div className="form-group" >
                                <input
                                    id={'selectedInvestorAccount' + productID}
                                    type='text'
                                    className='form-control'
                                    placeholder='Investor Account'
                                    readOnly />
                            </div>

                            <div className="form-group">
                                <input
                                    id={'selectedInvestorDueAmount' + productID}
                                    type='text'
                                    className='form-control'
                                    placeholder='Due Amount(in Wei)'
                                    readOnly /></div>
                        </div>) : null}
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
                    <button id={'submitButton' + productID} type='submit' title={toolTipPendingActionText} disabled={buttonDisabled} className={submitButtonVariant} size="sm" >{nextActionButtonValue}</button>
                </form>
            </span>
        );
    },
    userRating: function (props) {

        const val = props.record.userRating;
        let fields = props.fields;
        const toggleUserRatingConfirmViewHandler = fields[fields.length - 1].props.toggleUserRatingConfirmView;
        const activeUserAccount = fields[fields.length - 1].props.account;
        function ratingChanged(newRating) {
            toggleUserRatingConfirmViewHandler(props.record.ownerName, props.record.ownerAccount, newRating);
        }
        return (
            <div>
                <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    value={Number(val)}
                    size={15}
                    isHalf={false}
                    edit={props.record.ownerAccount !== activeUserAccount}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                />

            </div>
        );
    }
}