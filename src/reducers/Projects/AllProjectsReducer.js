const AllProjectsReducer = (state = {}, action) =>  {
	switch(action.type){
		case "AllProjectFetched":
			return action.payload;
		default:
			return state;
	}
}

export default AllProjectsReducer;