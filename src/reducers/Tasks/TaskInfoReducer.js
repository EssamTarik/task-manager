const TaskInfoReducer = (state={}, action) => {
	switch(action.type){
		case "TaskInfoFetched":
			return action.payload;
		default:
			return state;
	}
}

export default TaskInfoReducer;