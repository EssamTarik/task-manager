const SprintReducer = (state={}, action) => {
	switch(action.type){
		case "SprintFetched":
			return action.payload;
		default:
			return state;
	}
}

export default SprintReducer;