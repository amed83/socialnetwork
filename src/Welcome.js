import React from 'react';
import Registration from './Registration'


export default class Welcome extends React.Component{
    render(){
        return (
            <div className="welcome-main-container">
              <div className="welcome">
                  <h1> The Gig</h1>
                  <h3>Join the biggest show</h3>

              </div>
                <div>
                     {this.props.children}
                </div>
                <img id="logo-welcome-page"src='/img/logo2.png'/>
            </div>
        )
    }
}
