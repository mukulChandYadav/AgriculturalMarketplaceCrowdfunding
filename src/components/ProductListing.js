import React, { Component } from 'react';
//import {Redirect} from 'react-router-dom';
import { UserRoleToNum } from './Constants';
import PublishProductForm from './PublishProductForm';

const FilterableTable = require('react-filterable-table');
class ProductListing extends Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            loading: true,
            showPublishPage: false,
            dataReady: false,
            tableData: []
        }

        this.publishNewProduct = this.publishNewProduct.bind(this);
        //props.getPublishedProductDetails=props.getPublishedProductDetails.bind(this);
        //this.PublishButton = this.PublishButton.bind(this);

    }

    async publishNewProduct() {
        this.setState({ showPublishPage: true });
    }

    // var PublishButton = React.createElement({
    //         render: function () {
    //             return (
    //                 <button
    //                 hidden={this.props.userRole !== UserRoleToNum.FarmerRole.toString() ? true : false}
    //                 onClick={this.publishNewProduct}>
    //                 Publish New Product
    //                 </button>
    //             );
    //         }
    //     });

    async componentWillMount() {

        console.log("Product listing state & props");
        console.log(this.state);
        console.log(this.props);
        console.log(UserRoleToNum.FarmerRole, typeof UserRoleToNum.FarmerRole)
        console.log(this.props.userRole, typeof this.props.userRole)

    }

    render() {
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

        console.log("Is farmer:", this.props.userRole === UserRoleToNum.FarmerRole.toString());

        let fields = [
            { name: 'upc', displayName: "Universal Product code", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'ownerID', displayName: "Owner Account ID", inputFilterable: true, sortable: true },
            { name: 'sku', displayName: "Stock Keeping Units", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'originFarmerID', displayName: "Origin Farmer ID", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'originFarmName', displayName: "Origin Farm Name", inputFilterable: true, sortable: true },
            { name: 'productNotes', displayName: "Product Notes", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'beneficiary', displayName: "Crowd funding beneficiary", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'fundingStage', displayName: "Crowd funding product Stage", inputFilterable: true, sortable: true },
            { name: 'beneficiary', displayName: "Crowd funding beneficiary", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'fundingCap', displayName: "Crowd funding cap", inputFilterable: true, sortable: true },
            { name: 'deadline', displayName: "Crowdfunding deadline", inputFilterable: true, exactFilterable: true, sortable: true },
            { name: 'creationTime', displayName: "Product publish time", inputFilterable: true, exactFilterable: true, sortable: true },
        ];

        return (
            <div>
                <button
                    hidden={(this.props.userRole !== UserRoleToNum.FarmerRole.toString()) || this.state.showPublishPage ? true : false}
                    onClick={this.publishNewProduct}>
                    Publish New Product
                </button>
                {
                    this.state.showPublishPage ? <PublishProductForm account={this.props.accounts} {...this.state} {...this.props} /> : null
                }{

                    this.state.dataReady ?
                        <FilterableTable
                            namespace="People"
                            initialSort="name"
                            data={this.state.tableData}
                            fields={fields}
                            roRecordsMessage="There are no people to display"
                            noFilteredRecordsMessage="No people match your filters!"
                        /> : null
                }

            </div>

        )

    }
}
export default ProductListing;