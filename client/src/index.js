import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './index.css';
import Login from './Login'
import App from './App';

ReactDOM.render(

  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path = "/login" component={Login}/>
    </Switch>
  </Router>,
  document.getElementById('root'));
