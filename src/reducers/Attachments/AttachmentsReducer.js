const AttachmentsReducer = (state = [], action) => {
	switch(action.type){
		case "AttachmentsFoldersFetched":
			return action.payload;
		default:
			return state;
	}
}

export default AttachmentsReducer;