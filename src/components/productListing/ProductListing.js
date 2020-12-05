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

            { name: 'productFundingPageLink', displayName: "Pending Action", render: FieldRenderer.productFundingPageLink },
            { name: 'universalProductCode', displayName: "Universal Product Code", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'cropName', displayName: "Crop Name", inputFilterable: true, sortable: true },
            { name: 'quantity', displayName: "Quantity", sortable: true },
            { name: 'expectedPrice', displayName: "Expected Price", sortable: true },
            { name: 'requiredFunding', displayName: "Required Funding", sortable: true },
            { name: 'availableFunding', displayName: "Available Funding", sortable: true },
            { name: 'ownerAccount', displayName: "Owner Account", inputFilterable: true },
            { name: 'props', props: this.props },
        ];



        return (
            <div>
                <div>
                    <div >
                        <button className='btn btn-primary'
                            hidden={(this.props.userRole !== NumToUserRole['1'].toString()) || this.state.showPublishPage ? true : false}
                            onClick={this.publishNewProduct}>
                            Publish New Product
                        </button>
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
                                roRecordsMessage="There are no people to display"
                                noFilteredRecordsMessage="No people match your filters!"
                            /></div>) : null
                    }
                </div>
            </div>
        )
    }
}
export default ProductListing;