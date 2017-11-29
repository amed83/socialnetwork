import React from 'react';

export default function ProfilePic (props) {
    // if (!props.id) {
    //     return null;
    // })
    return (
        <div className="profilePic">
            <img
            src={props.image}
            alt={`${props.firstname} ${props.lastname}`}/>
            <button id= "changeimage-button" onClick={props.onClick} >Change your image</button>
        </div>
    );
}
