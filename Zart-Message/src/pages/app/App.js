import "./App.css";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import userService from "../../services/userService";
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import Chat from '../../components/Chat/Chat';
// import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: userService.getUser(),
      chatRoom: null
    };
  }
  // Returns the initial state values
  // getInitialState = () => {
  //   return {
  //     // colors,
  //     // code: this.genCode(colors.length),
  //     // selColorIdx: 0,
  //     // guesses: [this.getNewGuess()]
  //   }
  // }


  // click handlers
  handleUpdateChatRoom = (chatRoom) => {
    this.setState({chatRoom})
  }
  handleSignupOrLogin = () => {
    this.setState({user: userService.getUser()});
  }

  handleLogout = () => {
    userService.logout();
    this.setState({user: null});
  }

  componentDidMount () {

  }
  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" render={() => 
            <>
                <NavBar 
                  user={this.state.user} 
                  handleLogout={this.handleLogout}
                />
              <div className='chatroom-chat'>
                <ChatRooms 
                  handleUpdateChatRoom={this.handleUpdateChatRoom}
                  chatRoom={this.state.chatRoom} />
                  {this.state.chatRoom ? 
                  <Chat
                    handleUpdateChatRoom={this.handleUpdateChatRoom}
                    chatRoom={this.state.chatRoom}
                  /> : <p>Select a chat</p>}
                
              </div>
            </>
          } />
          <Route exact path='/signup' render={({ history }) => 
            <SignupPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          }/>
          <Route exact path='/login' render={({ history }) => 
            <LoginPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          }/>
        </Switch>
      </>
    );
  }
}

export default App;
