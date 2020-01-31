import React, { useEffect, useRef } from "react";
import styles from "./Chat.module.css";
import socket from '../../socket';
import {socket as socketIO} from '../../socket';
import userService from "../../services/userService";
import styled from 'styled-components';
import { useState } from "react";

const ChatWindow = (props) => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(props.chatRoom.messages);

    const messagesEnd = useRef(null)


    const handleSendMessage = async (e) => {
        e.preventDefault();
        const obj = {
            content: message,
            chatRoomId: props.chatRoom._id
        }
        socket.sendMessage(obj);
        setMessage('');
        handleUpdateViewedMessage();
    }
    
    const handleUpdateViewedMessage = () => {
        if (props.chatRoom) {
            if (messages) {
                socket.messageSeen({
                    userId: userService.getUser()._id, 
                    messageId: messages[messages.length - 1]._id,
                    chatRoomId: props.chatRoom._id
                });
            }
        }
    }

    const handleCloseChat = () => {
        props.handleUpdateChatRoom(null);
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const scrollToBottom = () => {
        // messagesEnd.current.scrollIntoView({ behavior: "smooth" })
        messagesEnd.current.scrollIntoView({behavior: 'auto'});
    }





    useEffect(scrollToBottom)
  

    socketIO.on('send-message', function(chat) {
        setMessages(chat.messages);
    });


    const Messages = styled.div`
        background-color: light-green;
        & > .messages {
            overflow-y: scroll;
            height: 900px;
            & > li {
                list-style: none;
            }
        }
    `;

    return (
        <div className={styles.chat} >
            <div className={styles.chatInfo}>info</div>
            <div className={styles.MessageFeed}>
            <p>MessageFeed</p>
            <button onClick={handleCloseChat}>X</button>
            <Messages>
            {messages ? 
                <ul className="messages">
                    {messages.map( m => <li key={m._id}>{m.username}:&nbsp;&nbsp;{m.content}</li>)}
                    <li>
                        <div ref={messagesEnd}></div>
                    </li>
                </ul>
            : <p>loading...</p>}
            </Messages>
            </div>
            <form onSubmit={handleSendMessage}>
                <input type="text" autoComplete='off' name="message" value={message} onChange={handleChange}/>
                <button type='submit'>submit</button>
            </form>
        </div>
    )

}

export default ChatWindow;

// class Chat extends React.Component {
//     state = {
//         message: '',
//         messages: null
//     }

    
    
//     getInitialState = (messages) => {
//         this.setState({messages})
//     }

//     // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//     //                    handle > Click <
//     handleSendMessage = async (e) => {
//         e.preventDefault();
        
        
//         const obj = {
//             content: this.state.message,
//             chatRoomId: this.props.chatRoom._id
//         }
//         socket.sendMessage(obj);
//         this.setState({message: ''});
//         this.handleUpdateViewedMessage();
//         // let chatPage = this;
//         // socketIO.on('send-message', async function(chatRoom) {
//         //     chatPage.setState({messages: chatRoom.messages})
//         // });
//     }
    
    

//     handleUpdateViewedMessage = () => {
//         if (this.props.chatRoom) {
//             if (this.state.messages) {
//                 socket.messageSeen({
//                     userId: userService.getUser()._id, 
//                     messageId: this.state.messages[this.state.messages.length - 1]._id,
//                     chatRoomId: this.props.chatRoom._id
//                 });
//             }
//         }
//     }
//     handleCloseChat = () => {
//         this.props.handleUpdateChatRoom(null);
//     }
//     // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//     //                      handle > Change <
//     handleChange = (e) => {
//         this.setState({[e.target.name]: e.target.value})
//     }

//     scrollToBottom = () => {
//         this.messagesEnd.current.scrollIntoView({ behavior: "smooth" });
//     }
//     // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//     //                   componant Functions
//     componentDidMount() {
//         this.scrollToBottom();
//         socket.registerChatWindow(this);
//         this.setState({messages: this.props.chatRoom.messages});
//         this.handleUpdateViewedMessage();
//     }
//     componentDidUpdate() {
//         this.scrollToBottom();
//     }
//     // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//     //                         render
//     render () {
//         const Messages = styled.div`
//             background-color: light-green;
//             & > .messages {
//                 overflow-y: scroll;
//                 height: 800px;
//                 background-color: red;
//             }
        
//         `;
        
//         return (
//         <div className={styles.chat} >
//             <div className={styles.chatInfo}>info</div>
//             <div className={styles.MessageFeed}>
//             <p>MessageFeed</p>
//             <button onClick={this.handleCloseChat}>X</button>
//             <Messages>
//             {this.state.messages ? 
//                 <ul className="messages">
//                     {this.state.messages.map( m => <li>{m.username}:&nbsp;&nbsp;{m.content}</li>)}
//                     <li>
//                         <div style={{ float:"left", clear: "both" }}
//                             ref={this.messagesEnd}>
//                         </div>
//                     </li>
//                 </ul>
//            : <p>loading...</p>}
//             </Messages>
//             </div>
//             <form onSubmit={this.handleSendMessage}>
//                 <input type="text" autoComplete='off' name="message" value={this.state.message} onChange={this.handleChange}/>
//                 <button type='submit'>submit</button>
//             </form>
//         </div>
//         );
//     };

// }
// export default Chat;
