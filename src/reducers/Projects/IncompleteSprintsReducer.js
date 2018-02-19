const AllSprintsReducer = (state=[], action) => {
	switch(action.type){
		case "IncompleteSprintsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default AllSprintsReducer;