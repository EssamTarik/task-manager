const TaskTimelogReducer = (state = [], action) => {
	switch(action.type){
		case "TaskTimelogFetched":
			return action.payload;
		default:
			return state;
	}
}

export default TaskTimelogReducer;