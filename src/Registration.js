import React from 'react';
import axios from 'axios';
import {Link} from 'react-router';

export default class Registration extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            error:false,
            firstname:"",
            lastname:"",
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
        axios.post('/register', {
            first: this.state.firstname,
            last: this.state.lastname,
            email:this.state.email,
            password:this.state.password
        }).then((result) =>{
            if(result.data.success){
                location.replace('/')
            }
            else{
                this.setState({
                  error:true
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }
    render() {
        return(
            <div>
                <div className="registration">
                    <input type = "text" name="firstname"  placeholder="First name" onChange={this.handleChange} value={this.state.firstname} />
                    <input type = "text" name="lastname" placeholder="Last name"onChange={this.handleChange} value={this.state.lastname} />
                    <input type="text" name="email" placeholder="Email" onChange={this.handleChange} value={this.state.email} />
                    <input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} />
                    <button onClick={() => this.handleSubmit()}>Sign-up</button>
                    <Link className="loginLink" to ='/login' >Sign-in</Link>
                </div>
                <div className="registration-error">
                    {this.state.error && <p>Something wrong!</p>}
                </div>
            </div>
        )
    }
}
