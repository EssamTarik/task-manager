function CurrentUserReducer(state=null, action){
	switch(action.type){
		case "SetCurrentUser":
			return action.payload;
		default:
			return state;
	}
}

export default CurrentUserReducer;