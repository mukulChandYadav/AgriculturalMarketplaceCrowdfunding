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

        //props.getPublishedProductDetails=props.getPublishedProductDetails.bind(this);
        //this.PublishButton = this.PublishButton.bind(this);

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

    // fundProduct(upc) {
    //     this.setState({
    //         loadFundProduct: true,
    //         fundedProduct: upc
    //     });
    // }

    render() {

        console.log("Is farmer:", this.props.userRole === NumToUserRole['1'].toString());

        let fields = [

            { name: 'productFundingPageLink', displayName: "Product Details", render: FieldRenderer.productFundingPageLink },
            { name: 'upc', displayName: "Universal Product code", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'sku', displayName: "Stock Keeping Units", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'productSupplyChainState', displayName: "Product Supplychain State", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'fundingStage', displayName: "Crowd funding product Stage", inputFilterable: true, sortable: true },
            { name: 'fundingCap', displayName: "Crowd funding cap", inputFilterable: true, sortable: true },
            { name: 'deadline', displayName: "Crowdfunding deadline", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'creationTime', displayName: "Product publish time", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'ownerID', displayName: "Owner Account ID", inputFilterable: true, sortable: true },
            { name: 'originFarmerID', displayName: "Origin Farmer ID", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'originFarmName', displayName: "Origin Farm Name", inputFilterable: true, sortable: true },
            { name: 'productNotes', displayName: "Product Notes", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'beneficiary', displayName: "Crowd funding beneficiary", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'productContractAddress', displayName: "Product Contract Address", inputFilterable: true, sortable: true },
            { name: 'props', props: this.props },
        ];

        return (
            <div>
                <div>
                    <div>
                        <button
                            hidden={(this.props.userRole !== NumToUserRole['1'].toString()) || this.state.showPublishPage ? true : false}
                            onClick={this.publishNewProduct}>
                            Publish New Product
                        </button>
                        <br />
                    </div>
                    {
                        this.state.showPublishPage ? <PublishProductForm account={this.props.accounts} {...this.state} {...this.props} /> : null
                    }{

                        this.state.dataReady ?
                            (<FilterableTable
                                namespace="People"
                                initialSort="name"
                                data={this.state.tableData}
                                fields={fields}
                                roRecordsMessage="There are no people to display"
                                noFilteredRecordsMessage="No people match your filters!"
                            />) : null
                    }
                </div>
            </div>
        )
    }
}
export default ProductListing;