const SprintNamesReducer = (state={}, action) => {
	switch(action.type){
		case "SprintNamesFetched":
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}

export default SprintNamesReducer;