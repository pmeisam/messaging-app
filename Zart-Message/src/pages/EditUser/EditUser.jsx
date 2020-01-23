import React, { Component } from 'react';
import userService from "../../services/uaerService";

class EditUser extends Component {
    state = {
        name: ""
      }
    handleClick = (e) => {
        e.preventDefault()
        userService.editUserName(this.state);
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    async componentDidMount() {
        var asghar = await userService.showUser();
        console.log("asghar: ", asghar)
    }
    componentDidCatch() {
        console.log('component did catch')
    }
    componentDidUpdate() {
        console.log('component did update')
    }
    // componentWillMount() {
    //     console.log('component will mount')
        
    // }
    // componentWillUpdate() {
    //     console.log('component will update')
    // }
    render() {
        return ( 
        <div>
            edit user name
            <form onSubmit={this.handleClick}>
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                <button type='submit' >submit</button>
            </form>

        </div>);
    }
}
 
export default EditUser;