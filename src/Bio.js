import React from 'react';
import axios from 'axios';
import FriendButton from './FriendButton'
export default class Bio extends React.Component{
    constructor(props) {

        super(props);
        this.state={
            showEditBio:false,
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.showBio=this.showBio.bind(this)
    }
    handleChange(e){
        this.setState({bio : e.currentTarget.value })
    }

    showBio(){
        this.setState({showEditBio: !this.showEditBio})
    }
    //update bio
    handleSubmit(){
        axios.post('/saveBio',{
            bio:this.state.bio
        }).then(({data})=>{
            if(data.success){
                this.props.changeBio(data.userBio)
                this.setState({showEditBio:false})
            }
        })

    }
    render(){
        const showEditBio=this.state.showEditBio
        const showBio =this.state.showBio
        return(
            <div className="bio-wrapper">
                <div className="bio-container">
                    {this.props.userdata.bio &&
                        <div className="showBio">
                            <p><strong>Name:</strong> {this.props.userdata.firstname} <br/><strong>Bio:</strong>  {this.props.userdata.bio}</p>
                             <button onClick={() => this.setState({showEditBio:true})}>Edit</button>
                        </div>
                    }
                </div>
                    {!this.props.userdata.bio && <button onClick={() => this.setState({showEditBio:true})}>Add your Bio</button>}
                    {showEditBio &&
                    <div className="insertbio-container">
                        <textarea rows="8" cols="30" onChange = {this.handleChange}></textarea>
                        <button onClick={() => this.handleSubmit()}> Save </button>
                    </div>
                    }
            </div>
        )
    }
}
