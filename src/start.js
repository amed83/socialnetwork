import React from 'react';
import ReactDOM from 'react-dom';
// import Logo from './Logo'
import axios from 'axios'
import Welcome from './Welcome'
import Login from './Login'
import Registration from './Registration'
import App from './App'
import Profile from './Profile'
import OtherUsersProfile from './OtherUsersProfile'
import Friends from './Friends'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import Online from './Online';
import PotentialFriends from './PotentialFriends'
import Chatroom from './Chatroom'


export const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxPromise)));


import { Router, Route, Link, IndexRoute, hashHistory,browserHistory } from 'react-router';


const router = (
    <Provider store={store} >
        <Router history={hashHistory}>
            <Route path="/" component={Welcome}>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Registration} />
                <IndexRoute component={Registration} />
      	    </Route>
        </Router>
     </Provider>
);



const isLoggedIn = location.pathname != '/welcome'


let component = router;

if (isLoggedIn) {

    component = (
        <Provider store ={store}>
            <Router history = {browserHistory}>
               <Route path= "/" component ={App}>
                    <IndexRoute component ={Profile} />
                    <Route path="/user/:id" component={OtherUsersProfile}/>
                    <Route path="/friends" component ={Friends}/>
                    <Route path="/people"  component ={PotentialFriends}/>
                    <Route path ="/online" component = {Online}/>
                    <Route path="/chat" component = {Chatroom} />
               </Route>
            </Router>
         </Provider>
    )
}



ReactDOM.render(component, document.querySelector('main'));
