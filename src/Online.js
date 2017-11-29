import React from 'react';
import{ connect } from 'react-redux'
import { onlineUsers,userJoined,userLeft } from './actions'
import { Link } from 'react-router'
 class Online extends React.Component{
    constructor(props){
        super(props)

        }

    render(){
            const{ onlineUser } = this.props
            if(!onlineUser){
                return null;
            }
            const onlineUsers =(
            <div id="online-container">
                {onlineUser.map(user => <p>
            <div><Link id="userprofile" to={'/user/'+user.id}><img src={user.image}/></Link></div> {user.firstname} {user.lastname}</p>)}
            </div>
            )
        return(
            <div className="onlineUsers">
                    {onlineUsers}
            </div>
        )
    }

}


const mapStateToProps = function(state) {
    return{
        onlineUser:state.users
    }
}



export default connect(mapStateToProps)(Online)
