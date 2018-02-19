const ProjectReducer = (state = {}, action) =>  {
	switch(action.type){
		case "ProjectFetched":
			return action.payload;
		default:
			return state;
	}
}

export default ProjectReducer;