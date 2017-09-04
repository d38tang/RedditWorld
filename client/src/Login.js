import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import './Login.css'

// Move authentication to backend later

const client_id = ""; //client id for reddit app,

class Login extends Component {

  render() {
    const state = ""; //state value for reddit app
    const authLink = 'https://www.reddit.com/api/v1/authorize?client_id=' + client_id + '&response_type=token&state=' + state
    + '&redirect_uri=http://localhost:3000&duration=temporary&scope=identity';

    return (
      <div className = "login-page">
        <div className = "jumbotron text-center">
          <h1 className = "display-2"> Reddit World </h1>
          <p className = "lead"> A chat room client for subreddits </p>
        </div>
        <div className = "text-center login-reddit">
          <h3>Login with <a href = {authLink}><i className="fa fa-reddit" aria-hidden="true"></i></a></h3>
        </div>
      </div>
    );
  }
}

export default Login;
