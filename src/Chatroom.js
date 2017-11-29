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


    render(){
        return(
            <div>
                <div id="textarea-chat-container">
                    <textarea rows="8" cols="40" id="chat-text-box"  onChange={this.handleChange} value={this.state.value} onKeyPress={this.handleKeyPress}>
                    </textarea>
                </div>
                <div className="chat-container" ref={elem => this.elem = elem}>
                        <div className="display-messages">
                            {this.props.chatMessages &&
                            this.props.chatMessages.map((msg) => <p><img src={msg.image} />
                             <span>{msg.firstname}</span> wrote: {msg.message }</p>)}
                        </div>

                </div>
            </div>
        )


    }

}

const mapStateToProps = function(state) {

    return{
            chatMessages:state.chatMessages,

    }
}


export default connect(mapStateToProps)(Chatroom)
