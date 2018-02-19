const AllSprintsReducer = (state=[], action) => {
	switch(action.type){
		case "AllSprintsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default AllSprintsReducer;