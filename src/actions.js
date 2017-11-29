// import axios from 'axios';
import axios from './utils/axios'


export function showFriends (){
    return axios.get('/friendsList').then(({data})=>{
        return{
            type:'SHOW_FRIENDS',
            friends:data
        }
    })
}

// export function receiveFriendRequest(id){
//     return axios.get('/receiveFriendRequest').then(({data})=<{
//         return{
//             type:'RECEIVE_REQUEST',
//             friend:data.friend
//         }
//     }
// }

export function acceptFriendshipRequest(id){
    return axios.post('/acceptFriendshipRequest/'+ id).then(({data})=>{
        return{
            type:'ACCEPT_FRIENDSHIP_REQUEST',
            id
        }
    })
}

export function endFriendship(id){
    console.log('inside actuin END RETURNING ID',id)
    return axios.post('/endFriendship/'+ id).then(({data})=>{
        return{
            type:'END_FRIENDSHIP',
            id
        }
    })
}

//CHAT sockets

export function onlineUsers (users) {
        return{
            type:'ONLINE_USERS',
            users:users.onlineUsersNow


    }

}
export function userJoined (user) {
        return{
            type:'USER_JOINED',
            user:user
        }
}

export function userLeft(id){
    return{
        type:'USER_LEFT',
        id:id
    }
}


export function newMessage(chatMessages){
    return{
        type:'NEW_MESSAGE',
        chatMessages
    }
}
