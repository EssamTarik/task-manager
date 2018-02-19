const ProjectPeopleReducer = (state=[], action) => {
	switch(action.type){
		case "ProjectPeopleFetched":
			return action.payload;
		default:
			return state;
	}
}

export default ProjectPeopleReducer;