import React from 'react';
import axios from 'axios';

export default class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            error:false,
            email:"",
            password:""
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handleChange(e){
        this.setState({ [e.currentTarget.name] : e.currentTarget.value }, ()=>{

        })

    }
    handleSubmit(){
        axios.post('/login', {
            email:this.state.email,
            password:this.state.password
        }).then((result) =>{
            if(result.data.success){
                location.replace('/')
            }else{
                console.log('diocanna');
                this.setState({
                  error:true
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }

    render(){
        return(
            <div>
                <div className="login-container">
                    <input type = "text" name="email"  placeholder="Email" onChange={this.handleChange} value={this.state.email} />
                    <input type = "password" name="password" placeholder="Password"onChange={this.handleChange} value={this.state.password} />
                    <button onClick={() => this.handleSubmit()}>Login <i className="fa fa-sign-in" aria-hidden="true"> </i> </button>
                </div>
                {this.state.error && <h3 id="error-message">Please insert correct data</h3>}
            </div>
        )
    }
}
