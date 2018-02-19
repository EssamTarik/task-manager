export default function TeamsReducer(state=[{text: 'default', value: 'default'}], action){
	switch(action.type){
		case "TeamListUpdated":
			return action.payload;	
		default:
			return state;
	}
}