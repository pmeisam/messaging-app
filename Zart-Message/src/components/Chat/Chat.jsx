import React from "react";
import styles from "./Chat.module.css";
import socket from '../../socket';
import userService from "../../services/userService";
import {socket as socketIO} from '../../socket';

// import {Link} from 'react-router-dom'


class Chat extends React.Component {
    
    state = {
        message: '',
        messages: null
    }


    getInitialState = (messages) => {
        this.setState({messages})
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                    handle > Click <
    handleSendMessage = async (e) => {
        e.preventDefault();
        
        
        const obj = {
            content: this.state.message,
            chatRoomId: this.props.chatRoom._id
        }
        socket.sendMessage(obj);
        this.setState({message: ''});
        this.handleUpdateViewedMessage();
        console.log(1);
        let chatPage = this;
        socketIO.on('send-message', async function(chatRoom) {
            console.log(chatRoom)
            console.log(await 2);
            chatPage.setState({messages: chatRoom.messages})
        });
        console.log(3)
    }
    
    

    handleUpdateViewedMessage = () => {
        if (this.props.chatRoom) {
            if (this.state.messages) {
                socket.messageSeen({
                    userId: userService.getUser()._id, 
                    messageId: this.state.messages[this.state.messages.length - 1]._id,
                    chatRoomId: this.props.chatRoom._id
                });
            }
        }
    }
    handleCloseChat = () => {
        this.props.handleUpdateChatRoom(null);
    }
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                      handle > Change <
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                   componant Functions
    componentDidMount() {
        socket.registerApp(this);
        this.setState({messages: this.props.chatRoom.messages});
        this.handleUpdateViewedMessage();
        console.log(4)
    }
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                         render
    render () {
        
        return (
        <div className={styles.chat}>
            <div className={styles.chatInfo}>info</div>
            <div className={styles.MessageFeed}>
            <p>MessageFeed</p>
            <button onClick={this.handleCloseChat}>X</button>
            {this.state.messages ?  
                <ul>
                    {this.state.messages.map( m => <li>{m.username}:&nbsp;&nbsp;{m.content}</li>)}
                </ul>
           : <p>loading...</p>}

            </div>
            <form onSubmit={this.handleSendMessage}>
                <input type="text" autoComplete='off' name="message" value={this.state.message} onChange={this.handleChange}/>
                <button type='submit'>submit</button>
            </form>
        </div>
        );
    };

}
export default Chat;
