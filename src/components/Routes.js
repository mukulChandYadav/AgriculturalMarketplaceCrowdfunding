import React, { Component } from 'react';

import ProductListing from './productListing/ProductListing';
import Register from './Register';
import PublishProductForm from './productListing/PublishProductForm';
import {
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import RouteWithSubRoutes from './RouteWithSubRoutes';

const routes = [
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/products",
        component: ProductListing,
    },{
        
        path: "/publishProduct",
        component: PublishProductForm,
    }
];

class Routes extends Component {
    render(
    ) {
        return (
            <Router>
                <div>
                    <Switch>
                        {routes.map((route, i) => (
                            <RouteWithSubRoutes key={i} {...route} />
                        ))}
                    </Switch>
                </div>
            </Router>)
    }
}

export default Routes;