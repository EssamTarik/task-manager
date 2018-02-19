const LogReducer = (state=[], action) => {
	switch(action.type){
		case "LogFetched":
			return action.payload;
		default:
			return state;
	}
}

export default LogReducer;