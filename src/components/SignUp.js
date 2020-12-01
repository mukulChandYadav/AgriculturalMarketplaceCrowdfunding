import React, { Component } from 'react';

class SignUp extends Component {



    render() {
        console.log("SignUp page");
        return (
            <div id="signUpForm" >
                <h2 > Sign Up portal</h2>
                <p>Welcome to portal for Decentralized crowdfunding of Agricultural Marketplace products.
                This portal leverages Ethereum based smart contract infrastructure to facilitate Agro-based product
                funding and supplychain management procedures in the form of a DApp</p>
                <button type="button" id="signupButton"
                    onClick={(event) => {
                        event.preventDefault()
                        console.log("Sign up button pressed")
                        this.props.signUpUser()
                    }} >Press to Sign Up</button>
            </div>
        )
    }
}
export default SignUp