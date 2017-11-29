import React from 'react';
import{ connect } from 'react-redux'
import{ newMessage } from './actions'

class Chatroom extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }

        this.handleChange=this.handleChange.bind(this)
        this.handleKeyPress=this.handleKeyPress.bind(this)
    }

    componentDidUpdate(){
        this.elem.scrollTop= this.elem.scrollHeight
    }


    handleChange(e){
        this.setState({ message: e.currentTarget.value })

    }

    handleKeyPress(e){
        if(e.key==="Enter"){
            const {socket,message,userid,firstname,lastname,image} = this.props
            e.preventDefault()
            socket.emit('chatMessage',{
                userid:userid,
                message:this.state.message,
                firstname:firstname,
                lastname:lastname,
                image:image,
            })
            e.target.value=""

        }
    }

// <div className="display-message-img">
    render(){
        return(
            <div className="chat-container" ref={elem => this.elem = elem}>

                    <textarea rows="8" cols="20"   onChange={this.handleChange} value={this.state.value} onKeyPress={this.handleKeyPress}>
                    </textarea>
                    <div className="display-messages">
                        {this.props.chatMessages &&
                        this.props.chatMessages.map((msg) => <p><img src={msg.image} />
                         <span>{msg.firstname}</span> wrote: {msg.message }</p>)}
                    </div>

            </div>
        )


    }

}

const mapStateToProps = function(state) {
    console.log('inside MapStateProp',state)
    return{
            chatMessages:state.chatMessages,

    }
}


export default connect(mapStateToProps)(Chatroom)



//inside render

// {this.renderChatMessages()}
