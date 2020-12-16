import React, { Component } from 'react';
//import {Link} from 'react-router-dom';
import { UserRoleToNum, NumToUserRole, /*FundingStage*/ } from '../Constants';
import PublishProductForm from './PublishProductForm';
import FieldRenderer from './FieldRenderer';


const FilterableTable = require('react-filterable-table');
class ProductListing extends Component {
    constructor(props) {
        super(props);
        console.log(props);


        this.publishNewProduct = this.publishNewProduct.bind(this);

        this.state = {
            loading: true,
            showPublishPage: false,
            dataReady: false,
            tableData: []
        }

    }

    async publishNewProduct() {
        this.setState({ showPublishPage: true });
    }


    async componentWillMount() {

        console.log("Product listing state & props");
        console.log(this.state);
        console.log(this.props);
        console.log(UserRoleToNum.FarmerRole, typeof UserRoleToNum.FarmerRole)
        console.log(this.props.userRole, typeof this.props.userRole)


        this.props.getPublishedProductDetails()
            .then(result => {
                if (result !== 'undefined' && result.length > 0) {

                    this.setState({
                        dataReady: true,
                        tableData: result
                    });
                    console.log("Data received for product listing")
                    console.log(result);
                }
            }).catch(err => {
                console.log(err);
            });

    }

    render() {

        console.log("Is farmer:", this.props.userRole === NumToUserRole['1'].toString());

        let fields = [

            { name: 'universalProductCode', displayName: "Universal Product Code", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'cropName', displayName: "Crop Name", inputFilterable: true, sortable: true },
            { name: 'productFundingPageLink', displayName: "Pending Action", render: FieldRenderer.pendingActionLink },
            { name: 'userRating', displayName: "Owner Rating", render: FieldRenderer.userRating },
            { name: 'quantity', displayName: "Quantity", sortable: true },
            { name: 'expectedPrice', displayName: "Expected Price", sortable: true },
            { name: 'requiredFunding', displayName: "Required Funding", sortable: true },
            { name: 'availableFunding', displayName: "Available Funding", sortable: true },
            { name: 'supplyChainStage', displayName: "Supplychain Stage", sortable: true },
            { name: 'ownerName', displayName: "Owner Name", sortable: true, inputFilterable: true, exactFilterable: true },
            { name: 'ownerAccount', displayName: "Owner Account", inputFilterable: true },
            { name: 'props', props: this.props },
        ];



        return (
            <div>
                <div>
                    <br />
                    <br />
                    <div >
                        {((this.props.userRole !== NumToUserRole['1'].toString()) || //Not farmer
                            (this.state.showPublishPage ? true : false)) ? null :
                            (<button className='btn btn-primary'
                                onClick={this.publishNewProduct}>
                                Publish New Product
                            </button>)}
                        <br />
                        <br />
                    </div>
                    {
                        this.state.showPublishPage ? <div><PublishProductForm account={this.props.accounts} {...this.state} {...this.props} /></div> : null
                    }{

                        this.state.dataReady ?
                            (<div><FilterableTable
                                namespace="People"
                                initialSort="name"
                                data={this.state.tableData}
                                fields={fields}
                                roRecordsMessage="There are no products to display"
                                noFilteredRecordsMessage="No product match your filters!"
                            /></div>) : null
                    }
                </div>
            </div>
        )
    }
}
export default ProductListing;