import React from 'react';
import{showFriends,acceptFriendshipRequest,endFriendship} from './actions'
import{ connect } from 'react-redux'
import { Link } from 'react-router'


 class Friends extends React.Component{
    constructor(props){
        super(props)
        this.renderFriendsList=this.renderFriendsList.bind(this)
        this.renderPendingsList=this.renderPendingsList.bind(this)
    }
    componentDidMount(){
        this.props.showFriends()
    }



    renderFriendsList(){

        if(this.props.friendsList.length===0){
            return (
                <div id="no-friend" >


                </div>
            )
        }
        return(
            <div>
              <h2>Friends</h2>
               {this.props.friendsList.map(friend =>
                <div> <p>{friend.firstname} {friend.lastname}</p> <Link id="userprofile" to={'/user/'+friend.id}><img src={friend.image}/></Link>
                  <div className="friendShipbuttons">
                      <button onClick={()=>{this.props.endFriendship(friend.id)}}>End Friendship</button>
                  </div>
              </div>)}
            </div>

        )
    }

    renderPendingsList(){
        if(this.props.friendsPending.length===0){
            return (
                <div></div>
            )
        }
        return(
            <div >
                <h2>Waiting</h2>
                {this.props.friendsPending.map(friend =>
                <div> <p>{friend.firstname} {friend.lastname}</p> <img src={friend.image}/>
                    <div className="friendShipbuttons">
                       <button onClick={()=>{this.props.acceptFriendshipRequest(friend.id)}}>Let's do it!</button>
                    </div>
                </div>)}
            </div>

        )
    }

    render(){

        if(!this.props.friendsList && !this.props.friendsPending){

            return null;
        }

        return(
                <div id="allFriends">
                    <div className="friends-container">
                        {this.renderFriendsList()}
                    </div>
                    <div className="friends-container">
                        {this.renderPendingsList()}
                    </div>
                </div>
        )
    }
}


const mapStateToProps = function(state) {
    return{
            friendsList:state.friends && state.friends.filter(friend => friend.status===3),
            friendsPending:state.friends && state.friends.filter(friend => friend.status===1),
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        showFriends: () => dispatch(showFriends()),
        endFriendship: (id) => dispatch(endFriendship(id)),
        acceptFriendshipRequest: (id) => dispatch(acceptFriendshipRequest(id))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Friends)
