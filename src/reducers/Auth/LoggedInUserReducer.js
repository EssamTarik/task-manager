const LoggedInUserReducer = (state={}, action) => {
	switch(action.type){
		case "UserLoggedIn":
			return action.payload;
		default:
			return state;
	}
}

export default LoggedInUserReducer;