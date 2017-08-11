import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import './App.css';
import ChatRoom from './Chat';
import Autosuggestion from './Autosuggestion';
import ('whatwg-fetch');

const queryString = require('query-string');
const Autosuggest = require('react-autosuggest')

const client_id = '_LzsbHYIfkPN8A';
const customState = 'BJ1JKK3434J77DFKLMH8LDKFI';

class AppHeader extends Component{

  constructor(props){
    super(props);
    this.state = {
      searchValue: ""
    }

    this.updateValue = this.updateValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    this.props.updateSearch(this.state.searchValue);
  }

  updateValue(newValue){
    this.setState({
      searchValue: newValue
    });
  }

  render(){

    return(
      <ul className="App-header nav nav-justified">
        <li className="nav-item">
          <h5>Reddit World</h5>
        </li>
        <li className="nav-item">
          <h5>Welcome, {this.props.user}</h5>
        </li>
        <li className="nav-item">
          <form onSubmit = {this.onSubmit} value = {this.state.searchValue}><Autosuggestion updateValue = {this.updateValue}/></form>
        </li>
      </ul>
    );
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isAuth: false,
      token: null,
      username: "",
      redirect: null,
      authError: null,
      subreddit: null,
      chat: []
    }

    this.checkAuth = this.checkAuth.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount(){
    this.checkAuth(this.props);
  }

  render() {
    return (

        <div className="App">
          {this.authHandler()}
        </div>

    );
  }

  // ----------------------------------------------------------------------------------------------------------
  // Functions to check reddit authentication and get authenticated user

  getUsername(){

    var app = this;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "bearer " + this.state.token)
    var requestObject = {
      method: 'GET',
      headers: myHeaders
    }

    fetch('https://oauth.reddit.com/api/v1/me.json', requestObject)
      .then(function(res) {
        res.json().then(function(info){
          console.log(info.name);
          app.setState({
            username: info.name
          })
        })
      })
  }

  checkAuth(url){

    if (this.state.isAuth === false && !queryString.parse(url.location.hash).access_token && !queryString.parse(url.location.hash).error){

      this.setState({
        isAuth: false,
        token: null,
        redirect: true,
        authError: null
      });
    }

    else if (this.state.isAuth === false && queryString.parse(url.location.hash).access_token && !queryString.parse(url.location.hash).error){

      const accessToken = queryString.parse(url.location.hash).access_token;
      const state = queryString.parse(url.location.hash).state;

      console.log(accessToken);
      console.log(state);

      if (state === customState){
        this.setState({
          isAuth: true,
          token: accessToken,
          redirect: null,
          authError: null
        }, function(){
          this.getUsername();
        });

      }
      else if (state !== customState){
        this.setState({
          isAuth: false,
          token: null,
          redirect: true,
          authError: null
        });

      }
    }
    else if (queryString.parse(url.location.hash.error)){
      this.setState({
        isAuth: false,
        token: null,
        redirect: null,
        authError: true
      });

    }
    else if (this.state.isAuth === true){
      return;
    }
  }

  authHandler(){
    if (this.state.isAuth === true){
      return(
        <div className = "content">
          <AppHeader user = {this.state.username} updateSearch = {this.updateSearch}/>
          <ChatRoom user = {this.state.username} subreddit = {this.state.subreddit} chat = {this.state.chat}/>
        </div>
      );
    }
    else if (this.state.isAuth === false && this.state.redirect === true){
      return(
        <div>
          <Redirect to = "/login"/>
        </div>
      );
    }
    else if (this.state.isAuth === false && this.state.authError === true){
      return(
        <div>
          <h1> Authorization Error: {queryString.parse(this.props.location.hash).error} </h1>
          <Link to = "/login">Login</Link>
        </div>
      );
    }
    else{
      return;
    }
  }

  //----------------------------------------------------------------------------------------------------

  updateSearch(searchValue){
    let parent = this;
    let requestBody = {
      subreddit: searchValue
    };

    let myRequest = new Request('http://localhost:3001/subreddits',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    fetch(myRequest)
      .then(function(response) {
          if(response.status == 200) return response.json();
          else {
            throw new Error('Something went wrong on api server!');
            parent.setState({
              subreddit: null
            });
        }
      })
      .then(function(response) {
        console.log(response.chat);
          if (response.result === "error"){
            parent.setState({
              subreddit: null
            });
          }
          else if (response.result === "success" && response.subreddit){
            parent.setState({
              subreddit: response.subreddit,  //store state of currently selected subreddit
              chat: response.chat //store initial chat history of selected subreddit for onboarding
            });
          };

      })
      // .catch(function(error) {
      //     console.log(this);
      //     this.setState({
      //       subreddit: null
      //     });
      // });
  }
}


export default App;
