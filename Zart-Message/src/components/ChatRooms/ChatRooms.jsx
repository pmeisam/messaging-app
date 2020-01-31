import React, { Component } from 'react'
import styles from './ChatRooms.module.css'
import service from "../../services/userService";
import userService from '../../services/userService';
import socket from '../../socket';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import {Link} from 'react-router-dom'


class ChatRooms extends Component{
    state = {
        user: service.getUser(),
        search: '',
        latestChat: null,
        chatsId: [],
        clickedChatId : null,
        foundUser: '',
        chat: null
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
        const userId = foundUser._id;
        socket.findChat({userId});
        
    }

    handleStartChat = async (userId) =>{
        this.props.handleUpdateChatRoom(null);
        socket.findChat({userId});
        const foundChat = this.state.chat;
        this.props.handleUpdateChatRoom(foundChat);
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

    componentDidMount = async() => {
        socket.registerChatRoom(this);

        if (this.state.user) {
            // const latestChat = await ChatService.getAllChats(this.state.user)
            // this.setState({latestChat: latestChat})
            socket.getChats({user: this.state.user});
        }
    }

    // <><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
    //                         render
    render(){
        const Rooms = styled.div`
            & > ul {
                & > li {
                    list-style: none;
                    & > button {
                        border: none;
                        border-top: 1px black solid;
                        border-bottom: 1px black solid;
                        margin: 0;
                        width: 100%;
                        height: 50px;
                        font-size: 20px;
                    }
                }
            }
        `;
        return(
            <div className={styles.chatroom}>
                <div className={styles.search}>
                    <form onSubmit={this.handleSearch} >
                        <TextField 
                            type="number" 
                            placeholder='search' 
                            name='search' 
                            value={this.state.search} 
                            onChange={this.handleChange}
                            id="standard-textarea"
                            label="Search"
                            placeholder="(123)456-7890"
                            multiline
                        ></TextField>
                        <Button variant='outlined' color='secondary' type='submit'>Search</Button>
                    </form>
                    {this.state.foundUser ? 
                        <button onClick={() => this.handleStartChat(this.state.foundUser._id)}>{this.state.foundUser.name}</button>
                         : 
                        <p>no user found</p>   
                }
                </div>
                <div className={styles.chatRooms}>
                    <Rooms>
                        {this.state.latestChat ?
                            <ul>
                                {this.state.latestChat.map(e => {
                                    return (
                                    <li key={e._id}>
                                        <button onClick={() => this.handleStartChat(e._id)} >{e.name} </button>
                                    </li>)
                                })}
                            </ul>
                        : <p>There is no chat yet.</p>
                        }
                    </Rooms>
                </div>

            </div>
        )
    }
}
export default ChatRooms;