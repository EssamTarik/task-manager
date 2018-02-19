const FreeTasksReducer = (state=[], action) => {
	switch(action.type){
		case "FreeTasksFetched":
			return action.payload;
		default:
			return state;
	}
}

export default FreeTasksReducer;