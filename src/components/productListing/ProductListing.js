import React, { Component } from 'react';
//import {Link} from 'react-router-dom';
import { NumToUserRole, /*FundingStage*/ } from '../Constants';
import PublishProductForm from './PublishProductForm';
import FieldRenderer from './FieldRenderer';
import PostUserRating from './PostUserRating';

const FilterableTable = require('react-filterable-table');
class ProductListing extends Component {
    constructor(props) {
        super(props);
        console.log('Product Listing received props:', props);

        //this.publishNewProductFormRef = React.createRef();
        this.publishNewProductView = this.publishNewProductView.bind(this);
        this.returnToProductListView = this.returnToProductListView.bind(this);
        this.toggleUserRatingConfirmView = this.toggleUserRatingConfirmView.bind(this);

        this.state = {
            loading: false,
            showPublishPage: false,
            tableData: this.props.data,
            openUserRatingConfirmView: false
        }
    }

    async publishNewProductView() {
        this.setState({ showPublishPage: true });
    }

    async toggleUserRatingConfirmView(userName, userAccount, receivedUserRating) {
        console.log("Toggle Popup");
        this.ratedUserName = userName;
        this.ratedUserAccount = userAccount;
        this.ratedUserReceivedRating = receivedUserRating;
        this.setState({ openUserRatingConfirmView: !this.state.openUserRatingConfirmView });
    }

    async returnToProductListView() {
        this.setState({ showPublishPage: false });
    }

    async componentDidMount() {

        console.log("Product listing state & props");
        console.log(this.state);
        console.log(this.props);
        console.log(this.props.userRole, typeof this.props.userRole);


        // this.props.data
        //     .then(result => {
        //         if (result !== 'undefined' && result.length > 0) {

        //             this.setState({
        //                 dataReady: true,
        //                 tableData: result
        //             });
        //             console.log("Data received for product listing");
        //             console.log(result);
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //     });

    }

    render() {

        console.log("Is farmer:", this.props.userRole === NumToUserRole['1'].toString());

        let fields = [

            { name: 'universalProductCode', displayName: "Universal Product Code", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'cropName', displayName: "Crop Name", inputFilterable: true, sortable: true },
            { name: 'productFundingPageLink', displayName: "Pending Action", render: FieldRenderer.pendingActionLink, },
            { name: 'userRating', displayName: "Owner Rating", render: FieldRenderer.userRating, },
            { name: 'quantity', displayName: "Quantity", sortable: true, inputFilterable: true, exactFilterable: true },
            { name: 'expectedPrice', displayName: "Expected Price", sortable: true },
            { name: 'requiredFunding', displayName: "Required Funding", sortable: true },
            { name: 'availableFunding', displayName: "Available Funding", sortable: true },
            { name: 'supplyChainStage', displayName: "Supplychain Stage", sortable: true, inputFilterable: true, exactFilterable: true },
            { name: 'ownerName', displayName: "Owner Name", sortable: true, inputFilterable: true, exactFilterable: true },
            { name: 'ownerAccount', displayName: "Owner Account", inputFilterable: true, sortable: true, exactFilterable: true },
            { name: 'props', displayName: "", props: { ...this.props, toggleUserRatingConfirmView: this.toggleUserRatingConfirmView } },
        ];

        //If Marketplace manager && product sold out
        // fields[2]={{ name: 'productFundingPageLink', displayName: "Pending Action", render: FieldRenderer.pendingActionLink, }

        if (this.state.loading) {
            return (
                <div id='loader' className='text-center'>
                    <p className='text-center'>Loading...</p>
                </div>
            )
        } else {


            return (
                <div>
                    <div>
                        <br />
                        <br />
                        <div >
                            {((this.props.userRole === NumToUserRole['1'].toString()) && !this.state.showPublishPage && !this.state.openUserRatingConfirmView) ?
                                (<button className='btn btn-primary'
                                    onClick={this.publishNewProductView}>
                                    Publish New Product
                                </button>) : null}
                            <br />
                            <br />
                        </div>
                        {
                            (this.state.showPublishPage) ? (<div><PublishProductForm
                                closePublishView={this.returnToProductListView}
                                account={this.props.accounts}
                                {...this.state} {...this.props} />
                            </div>) : null //ref={this.publishNewProductFormRef}
                        }{

                            (!this.state.showPublishPage && !this.state.openUserRatingConfirmView) ?
                                (<div><FilterableTable
                                    namespace="People"
                                    initialSort="name"
                                    data={this.state.tableData}
                                    fields={fields}
                                    roRecordsMessage="There are no products to display"
                                    noFilteredRecordsMessage="No product match your filters!"
                                /></div>) : null
                        }
                        {
                            this.state.openUserRatingConfirmView ? (<PostUserRating
                                postUserRating={this.props.postUserRating}
                                ratedUserName={this.ratedUserName}
                                ratedUserAccount={this.ratedUserAccount}
                                ratedUserReceivedRating={this.ratedUserReceivedRating}
                                toggleViewHandler={this.toggleUserRatingConfirmView} />) : null
                        }
                    </div>
                </div>
            )
        }
    }
}
export default ProductListing;