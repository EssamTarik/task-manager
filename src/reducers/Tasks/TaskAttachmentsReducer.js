const TaskAttachmentsReducer = (state={}, action) => {
	switch(action.type){
		case "TaskAttachmentsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default TaskAttachmentsReducer;