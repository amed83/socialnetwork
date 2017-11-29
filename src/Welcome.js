import React from 'react';
import Registration from './Registration'


export default class Welcome extends React.Component{
    render(){
        return (
            <div>
              <div className="welcome">
                  <h1>Rememebr it</h1>
                  
              </div>
                <div>
                     {this.props.children}
                </div>
            </div>
        )
    }
}
