const TasksReducer = (state = [], action) => {
	switch(action.type){
		case "TasksFetched":
			return action.payload;
		default:
			return state;
	}
}

export default TasksReducer;