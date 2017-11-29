import React from 'react';
import axios from 'axios';

export default class FriendButton extends React.Component{
    constructor(props){
        super(props)
        this.state={
            id:this.props.id
        }

    }
    componentDidMount(){
        const id = this.props.id
        console.log('inside component friendStatus before GET')
        axios.get(`/friendStatus/user/${id}`).then(({data})=>{
            this.setState({
                status:data.status,
                senderId:data.senderid,
                recipientId:data.recipientId
            })
        })
    }
    submitRequest(updateStatus){
        console.log('inside axios post friendStatus',this.props.paramsId)
        const id = this.props.paramsId
        axios.post(`/UpdateFriendStatus/user/${id}`,{
            updateStatus
        }).then(({data})=>{
            this.setState({
                status:data.status,
                senderId:data.senderid,
                recipientId:data.recipientId
            })
        })

    }
    render(){
                return(
                    <div className="friendButton">
                        {this.state.status===undefined &&
                        <button onClick={() => this.submitRequest(1)}>Send a Friend Request</button>}

                        {this.state.status===1 && this.state.senderId !==this.props.id &&
                        <button onClick={() => this.submitRequest(0)}>Cancel Request</button>}

                        {this.state.status===1 && this.state.senderId ===this.props.id &&
                        <button onClick={() => this.submitRequest(3)}>Accept Request</button>}

                        {this.state.status===3 &&
                        <button onClick={() => this.submitRequest(4)}>End FriendShip</button>}

                        {this.state.status===4 &&
                        <button onClick={() => this.submitRequest(1)}>Send a Friend Request</button>}
                    </div>
                )

            }

}
