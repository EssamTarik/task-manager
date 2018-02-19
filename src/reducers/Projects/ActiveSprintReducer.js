const ActiveSprintReducer = (state={}, action) => {
	switch(action.type){
		case "ActiveSprintFetched":
			return action.payload;
		default :
			return state;
	}
}

export default ActiveSprintReducer;