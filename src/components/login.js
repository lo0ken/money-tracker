import React, { Component } from "react";
import {connect} from 'react-redux';
import {userLoginFetch} from '../redux/actions';
import {Link, Redirect} from "react-router-dom";
import "./login.css";

class Login extends Component {

  state = {
    username: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.userLoginFetch(this.state)
  }

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handleSubmit}>
            <h3>Sign In</h3>

            <div className="form-group">
              <label>Username</label>
              <input type="text"
                     name='username'
                     value={this.state.username}
                     onChange={this.handleChange}
                     className="form-control"
                     placeholder="Enter username" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password"
                     name='password'
                     value={this.state.password}
                     onChange={this.handleChange}
                     className="form-control"
                     placeholder="Enter password" />
            </div>


            <button type="submit" onClick={this.handleSubmit.bind(this)} className="btn btn-primary btn-block">Submit</button>

            <div className="form-group">
              <p className="text-center">Don't have account? <Link to="/sign-up">Sign up here</Link></p>
            </div>
          </form>
          {this.props.currentUser.username != null && (
            <Redirect to="/"/>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

const mapStateToProps = state => ({
  currentUser: state.userAuth.currentUser
})


export default connect(mapStateToProps, mapDispatchToProps)(Login);