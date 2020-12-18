import React, { Component } from 'react'
import Identicon from 'identicon.js';
import logo from '../logo.png';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        ><ul><img src={logo} width="30" height="30" className="align-top" alt="" />
          &nbsp;Crowdfunded Agriculture Marketplace</ul>

        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <ul>
                {(this.props.userName !== undefined) ? (<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <strong id="UserName" className="text-secondary"> {'Name:' + this.props.userName}</strong>
                </li>) : null}
                {(this.props.userRole !== undefined) ? (<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <small id="UserRole" className="text-secondary">{'User Role:' + this.props.userRole}</small>
                </li>) : null}
                {(this.props.userBalance !== undefined) ? <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <small id="Balance" className="text-secondary">{'Balance:' + this.props.userBalance}</small>
                </li> : null}
              </ul>
            </small>
          </li>
        </ul>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
            {this.props.account
              ? <img
                className="ml-2"
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt=""
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;