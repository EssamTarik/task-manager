export default function ProjectsReducer(state={}, action){
	
	switch(action.type){
		case "ProjectsUpdated":
			return action.payload;
		default:
			return state;
	}
}