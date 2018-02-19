const TaskNamesReducer = (state={}, action) => {
	switch(action.type){
		case "TaskNamesFetched":
			return Object.assign({}, state, action.payload);
		
		default:
			return state;
	}
}

export default TaskNamesReducer;