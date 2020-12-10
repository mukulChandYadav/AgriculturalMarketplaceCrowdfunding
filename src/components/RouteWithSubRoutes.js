
import {Route} from "react-router-dom";
import React, { Component } from 'react';

class RouteWithSubRoutes extends Component {

    render() {
        console.log(this.props)
        const route = this.props;
        return (
            <Route
                path={route.path}
                render={props => (
                    // pass the sub-routes down to keep nesting
                    <route.component {...props} routes={route.routes} />
                )}
            ></Route>
        )
    }
}

export default RouteWithSubRoutes;