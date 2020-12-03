

import React, { Component } from 'react';


import SignUp from './SignUp';
import ProductListing from './ProductListing';
import Register from './Register';
import PublishProductForm from './PublishProductForm';
import {
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import RouteWithSubRoutes from './RouteWithSubRoutes';

const routes = [
    {
        path: "/signUp",
        component: SignUp
    },
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