const projectTabReducer = (state=1, action) => {
	switch(action.type){
		case "ProjectActiveTabChanged":
			return action.payload;
		default:
			return state;
	}
}

export default projectTabReducer;