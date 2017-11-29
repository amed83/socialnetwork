import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import FriendButton from './FriendButton'

export default class OtherUsersProfile extends React.Component{
    constructor(props){
        super(props)
            this.state={}
    }

    componentDidMount() {
        const id = this.props.params.id
        axios.get(`/user/${id}/profile`).then(({data}) =>{
            this.setState({
                firstname:data.firstname,
                lastname:data.lastname,
                id:data.id,
                bio:data.bio,
                image:data.image,
                paramsId:this.props.params.id
            })
        })
    }
    render(){
        if(!this.state.id){
            return null
        }
        return(
            <div>
                <FriendButton {...this.state} />
                <div className="otherUsers-profilePic">
                    <div id="otherUsersName">
                    <p>{this.state.firstname}   {this.state.lastname}</p>
                    </div>
                    <img
                    src={this.state.image}
                    alt={`${this.state.firstname} ${this.state.lastname}`}/>
                </div>
            </div>
        )
    }



}
