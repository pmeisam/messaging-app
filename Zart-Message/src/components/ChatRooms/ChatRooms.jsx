import React, { Component } from 'react'
import styles from './ChatRooms.module.css'
import service from "../../services/userService";
import ChatService from '../../services/chatService'
import socket from '../../socket';
import chatService from '../../services/chatService';
import userService from '../../services/userService';
// import {Link} from 'react-router-dom'


class ChatRooms extends Component{
    state = {
        user: service.getUser(),
        search: '',
        latestChat: null,
        chatsId: [],
        clickedChatId : null,
        foundUser: ''
    }
    
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                     handle Change

    handleChange = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }
    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                     handle Submit
    handleSearch = async (e) => {
        e.preventDefault();
        this.setState({search: this.state.search})
        const foundUser = await userService.findUser(this.state.search);
        this.setState({foundUser, search: ''});
    }

    handleStartChat = async (userId) =>{
        console.log(userId)
        const foundChat = await chatService.findChat(userId);
        console.log(foundChat)
        this.props.handleUpdateChatRoom(foundChat);
        // this.setState({clickedChatId : e.target.value})
        // this.setState({chatsId : [this.state.clickedChatId]})

        // await chatService.findClickedChat(this.state.chatsId)
    }
    handleStartExistingChat = async (chatId) => {
        const chat = await chatService.getChat(chatId);
        this.props.handleUpdateChatRoom(chat);
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

    componentDidMount = async() => {
        const latestChat = await ChatService.getAllChats(this.state.user)
        this.setState({latestChat: latestChat})
        console.log(latestChat)
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                         render
    render(){
        return(
            <div className={styles.chatroom}>
                <div className={styles.search}>
                    <form onSubmit={this.handleSearch} >
                        <input type="number" placeholder='search' name='search' value={this.state.search} onChange={this.handleChange} />
                        <button type='submit'>search</button>
                    </form>
                    {this.state.foundUser ? 
                        <button onClick={() => this.handleStartChat(this.state.foundUser._id)}>{this.state.foundUser.name}</button>
                         : 
                        <p>no user found</p>   
                }
                </div>
                <div className={styles.chatRooms}>
                    {this.state.latestChat ?
                        <ul>
                            {this.state.latestChat.map(e => {
                                return (
                                <li>
                                    <button onClick={() => this.handleStartExistingChat(Object.values(e)[0])} >{Object.keys(e)[0]} </button>
                                </li>)
                            })}
                        </ul>
                    : <p>nothing in here</p>
                    }
                </div>

            </div>
        )
    }
}
export default ChatRooms;