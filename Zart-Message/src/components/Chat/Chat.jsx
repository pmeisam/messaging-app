import React from "react";
import styles from "./Chat.module.css";
import socket from '../../socket';
import service from "../../services/uaerService";
import uaerService from "../../services/uaerService";
// import {Link} from 'react-router-dom'


class Chat extends React.Component {

    state = {
        message: '',
        messages: null
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                    handle > Click <
    handleSendMessage = (e) => {
        e.preventDefault();
        const obj = {
            content: this.state.message,
            chatRoomId: this.props.chatRoom._id
        }
        socket.sendMessage(obj);
        // const chatRoom = this.state.chatRoom;
        // const user = uaerService.getUser();
        // chatRoom.message.push({user, content: this.state.message});
        // this.setState({chatRoom: chatRoom, message: ''});
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
        this.setState({messages: this.props.chatRoom.message})
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
                    {this.state.messages.map( m => <li>{m.content}</li>)}
                </ul>
           : <p>loading...</p>}

            </div>
            <form onSubmit={this.handleSendMessage}>
                <input type="text" name="message" value={this.state.name} onChange={this.handleChange}/>
                <button type='submit'>submit</button>
            </form>
        </div>
        );
    };

}
export default Chat;
