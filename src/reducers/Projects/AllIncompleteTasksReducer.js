const IncompleteTasksReducer = (state={}, action) => {
	switch(action.type){
		case "AllIncompleteTasksFetched":
			return action.payload;
		default:
			return state;
	}
}

export default IncompleteTasksReducer;