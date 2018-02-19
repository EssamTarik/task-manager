const CompleteSprintsReducer = (state=[], action) => {
	switch(action.type){
		case "CompleteSprintsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default CompleteSprintsReducer;