export default function StatusReducer(state=[{text: 'default', value: 'default'}], action){
	switch(action.type){
		case "statusListUpdated":
			return action.payload;
		default:
			return state;
	}
}