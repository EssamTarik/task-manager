const TeamInfoReducer = (state = {}, action) => {
	switch(action.type){
		case "UpdateTeamInfo":
			return action.payload;
		default:
			return state;
	}
}

export default TeamInfoReducer;