import React from 'react';
import Logo from './Logo'
import axios from 'axios';
import ImageUpload from './ImageUpload'
import Profile from './Profile'
import {Link} from 'react-router'
import {socket} from './socket'
import ProfilePic from './ProfilePic'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        let mySocket= socket()
        this.state = {
            showImageUpload: false,
            socket: mySocket
        };
    }

    showImageUpload(){
        this.setState({
            showImageUpload:!this.state.showImageUpload
        })
    }

    componentDidMount() {
        axios.get('/user').then(({ data }) => {
            this.setState({
                firstname:data.firstname,
                lastname:data.lastname,
                userid:data.id,
                image:data.image,
                bio:data.bio
            });
        });
    }
    render() {
        const {socket,firstname,lastname,userid,image,bio} = this.state
        const cloneChildren = React.cloneElement(this.props.children,
             {
                 socket,
                 firstname,
                 lastname,
                 userid,
                 image,
                 bio,
                 changeBio:bio => {this.setState({bio:bio})}

             })
        return (
            <div className="app-main-container">
                <header className="navbar">
                <Logo />
                        <div id="navbar-container">
                            <Link to="/friends" style={{ textDecoration: 'none' }}><h2 className="friends-chat-Link"> Friends </h2> </Link>
                            <Link to ="/chat" style={{ textDecoration: 'none' }}><h2 className="friends-chat-Link" >Chat</h2></Link>
                            <Link to ="/online" style={{ textDecoration: 'none' }}><h2 className="friends-chat-Link" >Online</h2></Link>
                        </div>
                    <div id="profilePic-container">
                        <ProfilePic
                             firstname={firstname}
                             lastname={lastname}
                             image={image}
                             onClick={()=>this.showImageUpload()}
                         />
                    </div>
                </header>
                {this.state.showImageUpload && <ImageUpload onClick={()=>this.showImageUpload()} updateImg={url => this.setState({ image: url,showImageUpload:false })} />}
                {cloneChildren}

            </div>
        )
    }
}
