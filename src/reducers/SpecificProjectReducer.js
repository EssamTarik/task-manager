const SpecificProjectReducer = (state = {}, action) => {
	switch(action.type){
		case "SpecificProjectUpdated":
			return action.payload;
		default:
			return state;
	}
}

export default SpecificProjectReducer;