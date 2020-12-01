

import React, { Component } from 'react';


import SignUp from './SignUp';
import Products from './Products';
import Register from './Register';
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
        component: Products,
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