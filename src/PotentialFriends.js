import React from 'react';
import{ connect } from 'react-redux'
import { potentialFriends } from './actions'

 class PotentialFriends extends React.Component{

   componentDidMount(){
       this.props.potentialFriends()
   }

   render(){

       const { peopleList } = this.props
       console.log('inside render pot',peopleList);
       const showPeople =(
           <div id="showPeople">
                {peopleList}
           </div>

       )
       return(
            <div>
                    {showPeople}
            </div>
           )
     }
}


const mapStateToProps = function(state) {
   return{
        peopleList:state.people&& state.people.map(person => <div><p>{person.firstname} {person.lastname}</p></div>)
   }
}

const mapDispatchToProps = function(dispatch) {
   return {
       potentialFriends: () => dispatch(potentialFriends())
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(PotentialFriends)
// {peopleList.map(friend => <div> <p>{friend.firstname} {friend.lastname}</p></div>)}
