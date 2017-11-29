

export default function(state={},action){

    if (action.type == 'SHOW_FRIENDS'){
        state = Object.assign({},state,{
            friends:action.friends
        })
    }

    // if(action.type == 'RECEIVE_REQUEST'){
    //     state = Object.assign({},state,{
    //         friends:action.friends
    //     })
    // }


    if(action.type=='END_FRIENDSHIP'){
        console.log('inside end friendship',state.friends)
        state = Object.assign({},state,{
            friends:state.friends.map(function(friend){
                if(friend.id===action.id){
                    return Object.assign({},friend,{
                        status:undefined
                })
                }else {
                return friend
                }
            })
        })
    }

    if(action.type=='ACCEPT_FRIENDSHIP_REQUEST'){
        state = Object.assign({},state,{
            friends:state.friends.map(function(friend){
                if(friend.id==action.id){
                    return Object.assign({},friend,{
                        status:3
                    })
                }else{
                    return friend
                }
            })
        })
    }


    if(action.type =='ONLINE_USERS'){
        state = Object.assign({},state,{
            users:action.users
        })
    }

    if(action.type =="USER_JOINED"){
        if (state.users && !state.users.find(user => user.id == action.user.id)) {
       state = Object.assign({}, state, {
           users: [...state.users, action.user]
            })
        }

    }

    if(action.type == "USER_LEFT"){
        state = Object.assign({}, state, {
         users: state.users.filter(user => user.id !== action.id.id)
       });

    }

    if(action.type=='NEW_MESSAGE'){
        state= Object.assign({},state,{
            chatMessages:action.chatMessages
        })
    }

    return state;

}
