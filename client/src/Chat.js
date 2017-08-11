import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Chat.css'
import ('whatwg-fetch');
const io = require('socket.io-client');

const socket = io.connect('http://localhost:3001')

export default class ChatRoom extends Component{
  constructor(props){
    super(props);

    this.state = {
      message: "",
      chat: [],
      onBoarded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  // when a new subreddit chatroom is selected, reset chat
  componentWillReceiveProps(){
      this.setState({
        chat: [],
        onBoarded: false
      })
  }

  componentDidMount(){

    let parent = this; // let parent hold reference to ChatRoom object

    socket.on('chat message', function(chatHistory){
      console.log(chatHistory);
      parent.setState({
        chat: chatHistory
      })

    });
  }


  render(){
    if (this.props.subreddit){
      return(
        <div>
          <h1 className = "subreddit-name"> r/{this.props.subreddit} </h1>
          <div className = "chatbox center-block">
            <ShowChatHistory state = {this.state} user = {this.props.user} parent = {this} initialChat = {this.props.chat}/>
            <MessageForm value = {this.state.message} onChange = {this.handleChange} onSubmit = {this.handleSubmit}/>
          </div>
        </div>

      );
    }
    else{
      return(
        <h1 className = "subreddit-name">No or invalid subreddit selected</h1>
      )
    }
  }



  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event){

    event.preventDefault();
    socket.emit('chat message', {
      message: this.state.message,
      user: this.props.user,
      subreddit: this.props.subreddit
    });

    this.setState({message: ""});
  }

}

function MessageForm(props){

    return(
      <form className = "messageInput"action = "" autoComplete = "off" onSubmit = {props.onSubmit}>
        <input id="form" value = {props.value} onChange={props.onChange} />
        <input type = "submit" style= {{display: "none"}}/>
      </form>
    )
}

function ShowChatHistory(props){

  //During onboarding, set chat history to chat history retrieved from database
  if (!props.state.onBoarded){
    props.parent.setState({
      chat: props.initialChat,
      onBoarded: true
    });
  }

  const chatHistory =  props.state.chat.map(function(message){

    if (message.user == props.user){  // if currently logged in user sent the message style the message with currentUser class for easy identification
      return <li className = "currentUser" key = {message._id.toString()} >{message.user}: {message.message}</li>
    }
    else return <li key = {message._id.toString()} >{message.user}: {message.message}</li>
  })

  return(
    <ul id = "messages">{chatHistory}</ul>
  )

}
