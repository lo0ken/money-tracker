import React, { Component } from "react";
import {connect} from 'react-redux';
import {userPostFetch} from '../redux/actions';
import {Link} from "react-router-dom";

class Signup extends Component {
  state = {
    username: "",
    password: "",
    phone: "",
    email: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(this.state)
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          window.alert("something went wrong" + data.message)
        } else {
          this.props.history.push("/sign-in")
        }
      })
  }

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handleSubmit}>
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>Username</label>
              <input
                name='username'
                placeholder='Username'
                value={this.state.username}
                onChange={this.handleChange}
                type="text"
                className="form-control" />
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

            <div className="form-group">
              <label>Email address</label>
              <input type="email"
                     name='email'
                     value={this.state.email}
                     onChange={this.handleChange}
                     className="form-control"
                     placeholder="Enter email" />
            </div>

            <div className="form-group">
              <label>Phone number</label>
              <input type="text"
                     name='phone'
                     value={this.state.phone}
                     onChange={this.handleChange}
                     className="form-control"
                     placeholder="Enter phone number" />
            </div>


            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            <p className="forgot-password text-right">
              Already registered <Link to="/sign-in">sign in?</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  userPostFetch: userInfo => dispatch(userPostFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Signup);