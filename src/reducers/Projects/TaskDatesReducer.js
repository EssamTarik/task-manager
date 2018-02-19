const TaskDatesReducer = (state={}, action) => {
	switch(action.type){
		case "TaskStartDatesFetched":
			return action.payload;
		default:
			return state;
	}
}

export default TaskDatesReducer;