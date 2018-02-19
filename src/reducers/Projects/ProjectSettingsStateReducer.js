const ProjectSettingsStateReducer = (state=false, action) => {
	switch(action.type){
		case "ProjectSettingsState":
			return action.payload;
		default:
			return state;
	}
}

export default ProjectSettingsStateReducer;