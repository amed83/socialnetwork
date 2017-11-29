import * as io from 'socket.io-client';
import { store } from './start';
import { onlineUsers,userJoined,userLeft,newMessage } from './actions';
import axios from 'axios';


let socket;

function getSocket() {
    if (!socket) {
        socket = io.connect();
        socket.on('connect', function() {
            axios.get(`/connected/${socket.id}`);

        });

        socket.on('onlineUsers', function(users) {
            console.log('inside onlineUsers',users);

            store.dispatch(onlineUsers(users));
        });

        socket.on('userJoined', function(user) {
            store.dispatch(userJoined(user));
        });

        socket.on('userLeft', function(id) {
            store.dispatch(userLeft(id));
        });
        //
        socket.on('newMessage',function(chatMessages){
            console.log('new message received',chatMessages);
            store.dispatch(newMessage(chatMessages.chatMessages));
        });
        //chat: chatMessages.push(data)
        //socket.broadcast.emit('newMessage',chatMessages }
    }
    return socket;
}

export { getSocket as socket }
