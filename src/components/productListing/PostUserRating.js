import React, { Component } from 'react';
import '../../css/ProductListing.css';

class PostUserRating extends Component {



  render() {
    return (<div id='content' className='centered'>
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.postUserRating(
          this.userRating.value,
          this.userAccount.value
        )
      }}>
        <div className='form-group mr-sm-2' >

          <h3>Provide User Rating</h3>
          <div className="form-group">
            <label htmlFor='userName'>User Name</label>
            <input
              id='userName'
              type='text'
              className='form-control'
              value={this.props.ratedUserName}
              readOnly />
          </div>

          <div className="form-group" >
            <label htmlFor='userAccount' >User Account</label>
            <input
              id='userAccount'
              type='text'
              ref={(input) => { this.userAccount = input }}
              className='form-control'
              value={this.props.ratedUserAccount}
              readOnly />
          </div>

          <div className="form-group">
            <label htmlFor='userRating'>User Rating</label>
            <input
              id='userRating'
              type='text'
              ref={(input) => { this.userRating = input }}
              className='form-control'
              value={this.props.ratedUserReceivedRating}
              readOnly /></div>
        </div>
        <button type='submit' className='btn btn-primary'>Rate User</button>
        &nbsp;&nbsp;
        <button onClick={(event) => { event.preventDefault(); this.props.toggleViewHandler(); }} className='btn btn-danger'>Cancel</button>
      </form>
    </div>
    );
  }
}

export default PostUserRating;