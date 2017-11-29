import React from 'react';

export default function ProfilePic (props) {

    return (
        <div >
            <img
            src={props.image}
            alt={`${props.firstname} ${props.lastname}`}/>
            <button id= "changeimage-button" onClick={props.onClick} >Change your image</button>
        </div>
    );
}
