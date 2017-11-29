import React from 'react';
import Bio from './Bio'
import FriendButton from './FriendButton'


export default class Profile extends React.Component{
    constructor(props){
        super(props)
            this.state={
            }
    }
    render(){
            return(
                <div>
                    <div className="userImageAndBio">
                        <img
                        src={this.props.image}
                        alt={`${this.props.firstname} ${this.props.lastname}`}/>
                        <Bio userdata= {this.props}
                        changeBio={this.props.changeBio} />

                    </div>
                </div>
            )
    }
}
