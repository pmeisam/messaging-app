import "./App.css";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import userService from "../../services/uaerService";
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import EditUserPage from '../EditUser/EditUser'
import ChatRooms from '../../components/ChatRooms/ChatRooms'
import Chat from '../../components/Chat/Chat'

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: userService.getUser(),
      chatRoom: null
    };
  }
  handleUpdateChatRoom = (chatRoom) => {
    this.setState({chatRoom})
  }
  handleSignupOrLogin = () => {
    this.setState({user: userService.getUser()});
  }
  
  componentDidMount () {
    
  }

  handleLogout = () => {
    userService.logout();
    this.setState({user: null});
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
          <Route exact path='/editUser' render={({ history }) => 
            <EditUserPage
              history={history}
            />
          }/>
        </Switch>
      </>
    );
  }
}

export default App;
